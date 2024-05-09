import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import isString from 'lodash/isString';
import noop from 'lodash/noop';
import ComponentBridge from '../../ComponentBridge';
import ComponentBridgeDefinition from '../../ComponentBridgeDefinition';
import ComponentBridgeOptions from '../../ComponentBridgeOptions';
import ComponentBridgeProps from '../../ComponentBridgeProps';
import FeatureBridge from '../FeatureBridge';
import FeatureBridgeOptions from '../FeatureBridgeOptions';
import EventDefinition from './EventDefinition';

// 各種デフォルト値
const _GROUP = Symbol('default'),
  _ON = <C, O>(
    instance: C,
    eventName: string,
    listener: (...args: unknown[]) => unknown,
    options: FeatureBridgeOptions<O>,
  ) => {
    if (instance instanceof HTMLElement) {
      instance.addEventListener(eventName, listener);
    }
  },
  _UN = <C, O>(
    instance: C,
    eventName: string,
    listener: (...args: unknown[]) => unknown,
    options: FeatureBridgeOptions<O>,
  ) => {
    if (instance instanceof HTMLElement) {
      instance.removeEventListener(eventName, listener);
    }
  };

/**
 * コンポーネントのプロパティをReactのステートに連携する為のクラス
 * コンポーネントから取得できるプロパティは、メソッドの実行毎に異なるインスタンスを返すものもある為、
 * 単純にReactのステートと連携をすると取得と設定の無限ループになる場合がある。
 * 当クラスでは前回取得したインスタンスと同じインスタンスを設定しようとした場合は、設定処理を実行しないという制御を行う。
 */
class EventBridge<
  C = HTMLElement,
  P extends ComponentBridgeProps<C> = ComponentBridgeProps<C>,
  O extends ComponentBridgeOptions = ComponentBridgeOptions,
> implements FeatureBridge<C, P, O>
{
  /**
   * ブリッジ定義
   */
  private _definitions: EventDefinition<C, P, O>[];

  /**
   * イベント名でアクセスしやすくしたマップ
   */
  private _events: {
    [eventName: string]: EventDefinition<C, P, O>;
  } = {};

  /**
   * コンポーネントのイベントリスナー
   */
  private _listeners: {
    [eventName: string]: (...args: unknown[]) => unknown;
  } = {};

  /**
   * 実際にコンポーネントのインスタンスへ追加するイベントリスナー
   */
  private _instanceListeners: {
    [eventName: string]: (...args: unknown[]) => unknown;
  } = {};

  /**
   * 排他が設定されているグループ毎のリスナー
   */
  private _groupListeners: {
    [groupName: string | symbol]: {
      eventName: string | null;
      listener: (...args: unknown[]) => unknown;
    };
  } = {};

  /**
   * コンポーネントのインスタンス固有のイベントハンドラー追加処理
   */
  private _on?: (
    instance: C,
    eventName: string,
    listener: (...args: unknown[]) => unknown,
    options: FeatureBridgeOptions<O>,
  ) => void;

  /**
   * コンポーネントのインスタンス固有のイベントハンドラー削除処理
   */
  private _un?: (
    instance: C,
    eventName: string,
    listener: (...args: unknown[]) => unknown,
    options: FeatureBridgeOptions<O>,
  ) => void;

  /**
   * コンストラクター
   * @param definition ブリッジ定義
   */
  constructor(definition: ComponentBridgeDefinition<C, P, O>) {
    const me = this,
      { events = [], on = _ON, un = _UN } = definition,
      eventDefinitions = events.map(me.toEventDefinition);

    // 定義を持っておく
    me._definitions = eventDefinitions;

    // eventNameでアクセスできるように持ち方を変換
    for (const eventDefinition of eventDefinitions) {
      me._events[eventDefinition.eventName] = eventDefinition;
    }

    // インスタンス固有の処理を設定
    me._on = on;
    me._un = un;
  }

  /**
   * イベント名のみが指定された定義をイベント定義に変換する
   * @param event
   * @returns
   */
  private toEventDefinition(event: EventDefinition<C, P, O> | string) {
    if (isString(event)) {
      // イベント名のみが指定されている場合は汎用的なイベントハンドラーを作成
      return {
        eventName: event,
        handlerName: `on${capitalize(event)}`,
        createListener: (bridge, handler) => handler,
      };
    } else {
      return event;
    }
  }

  /**
   * イベントリスナーの設定
   * @param eventName イベント名
   * @param handler Reactのハンドラー
   * @param options オプション
   */
  on(
    bridge: ComponentBridge<C, P, O>,
    eventName: string,
    handler?: (...args: unknown[]) => unknown,
    options?: FeatureBridgeOptions<O>,
  ) {
    const me = this,
      instanceListeners = me._instanceListeners,
      eventDefinition = me._events[eventName];
    if (eventDefinition) {
      if (!instanceListeners[eventName]) {
        // 実際にコンポーネントのインスタンスへ追加するリスナーを作成
        let instanceListener;
        // 排他の確認
        const exclusive = eventDefinition.exclusive;
        if (exclusive) {
          // 排他あり
          const groupName = exclusive === true ? _GROUP : exclusive;
          instanceListener = me._createExclusiveInstanceListener(eventName, groupName);
        } else {
          // 排他なし
          instanceListener = me._createInstanceListener(eventName);
        }
        // インスタンスへのリスナーの追加方法が定義されている場合
        me._on(bridge.instance, eventName, instanceListener, options);
        instanceListeners[eventName] = instanceListener;
      }
      // instanceListener内で実行するリスナーを作成
      me._listeners[eventName] = eventDefinition.createListener(bridge, handler || noop, options);
    }
  }

  /**
   * グループ毎に排他制御されたリスナーを作成する
   * @param eventName イベント名
   * @param groupName グループ名
   * @returns
   */
  private _createExclusiveInstanceListener(eventName: string, groupName: string | symbol) {
    const me = this;
    let groupListener = me._groupListeners[groupName];
    if (!groupListener) {
      // グループ内で排他を行う関数を作成
      groupListener = {
        eventName: null,
        listener: debounce((...args) => {
          // その時点のリスナーを実行
          const fn = me._listeners[groupListener.eventName];
          if (fn) {
            return fn(...args);
          }
        }),
      };
      me._groupListeners[groupName] = groupListener;
    }
    // グループが同じイベントは内部的に同じリスナーを使用する
    return (...args) => {
      groupListener.eventName = eventName;
      return groupListener.listener(...args);
    };
  }

  /**
   * 対象のイベントのイベントリスナーを作成する
   * @param eventName イベント名
   * @returns
   */
  private _createInstanceListener(eventName: string) {
    const me = this;
    return (...args) => {
      // その時点のリスナーを実行
      const fn = me._listeners[eventName];
      if (fn) {
        return fn(...args);
      }
    };
  }

  /**
   * イベントリスナーの削除
   * @param eventName イベント名
   * @param listener イベントリスナー
   * @param options オプション
   */
  un(bridge: ComponentBridge<C, P, O>, eventName: string, options: FeatureBridgeOptions<O>) {
    const me = this,
      instanceListener = me._instanceListeners[eventName];
    if (instanceListener) {
      // インスタンスのリスナーの削除方法が定義されている場合
      me._un(bridge.instance, eventName, instanceListener, options);
      delete me._instanceListeners[eventName];
    }
  }

  /**
   * プロパティ更新時の処理
   * @param bridge ブリッジ
   * @param newProps 更新後のプロパティ
   * @param oldProps 更新前のプロパティ
   * @param options オプション
   */
  update(bridge: ComponentBridge<C, P, O>, newProps: P, oldProps: P, options: FeatureBridgeOptions<O>): void {
    const me = this,
      events = me._definitions;
    // イベントハンドラの更新
    for (const event of events) {
      const { eventName, handlerName } = event;
      if (handlerName == null) {
        // reactのハンドラーの指定がない場合
        me.on(bridge, eventName, null, options);
      } else {
        // reactのハンドラーの指定がある場合
        const newHandler = newProps[handlerName],
          oldHandler = oldProps[handlerName];
        if (newHandler !== oldHandler) {
          // bridgeを介してイベントリスナーをinstanceへ設定
          me.on(bridge, eventName, newHandler, options);
        }
      }
    }
  }

  /**
   * 当クラスを破棄する際の処理
   * @param bridge ブリッジ
   * @param options オプション
   */
  destructor(bridge: ComponentBridge<C, P, O>, options: FeatureBridgeOptions<O>): void {
    const me = this;
    for (const eventName in me._instanceListeners) {
      // 自分が追加したリスナーは削除しておく
      me.un(bridge, eventName, options);
    }
    delete me._definitions;
    delete me._events;
    delete me._listeners;
    delete me._instanceListeners;
    delete me._groupListeners;
    delete me._on;
    delete me._un;
  }
}
export default EventBridge;
