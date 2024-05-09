import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import ComponentBridge from '../../ComponentBridge';
import ComponentBridgeDefinition from '../../ComponentBridgeDefinition';
import ComponentBridgeOptions from '../../ComponentBridgeOptions';
import ComponentBridgeProps from '../../ComponentBridgeProps';
import FeatureBridge from '../FeatureBridge';
import FeatureBridgeOptions from '../FeatureBridgeOptions';
import AccessorDefinition from './AccessorDefinition';

/**
 * コンポーネントのプロパティをReactのステートに連携する為のクラス
 * コンポーネントから取得できるプロパティは、メソッドの実行毎に異なるインスタンスを返すものもある為、
 * 単純にReactのステートと連携をすると取得と設定の無限ループになる場合がある。
 * 当クラスでは前回取得したインスタンスと同じインスタンスを設定しようとした場合は、設定処理を実行しないという制御を行う。
 */
class AccessorBridge<
  C = HTMLElement,
  P extends ComponentBridgeProps<C> = ComponentBridgeProps<C>,
  O extends ComponentBridgeOptions = ComponentBridgeOptions,
> implements FeatureBridge<C, P, O>
{
  /**
   * コンポーネントのプロパティを設定・取得する為のアクセサー
   */
  private _accessors: {
    [propName: string]: AccessorDefinition<C, P, O>;
  } = {};

  /**
   * 最後に取得した値
   * ここに持っている値と異なる値が設定される場合のみ、インスタンスへ反映する
   */
  private _latestState: { [name: string]: unknown } = {};

  /**
   * コンストラクター
   * @param definition ブリッジ定義
   */
  constructor(definition: ComponentBridgeDefinition<C, P, O>) {
    const me = this,
      { accessors = [] } = definition,
      accessorDefinitions = accessors.map(me.toAccessorDefinition);

    // propsNameでアクセスできるように持ち方を変換
    for (const accessorDefinition of accessorDefinitions) {
      me._accessors[accessorDefinition.propName] = accessorDefinition;
    }
  }

  /**
   * プロパティ名のみの指定された定義をアクセサー定義に変換する
   * @param accessor
   * @returns
   */
  private toAccessorDefinition(accessor: AccessorDefinition<C, P, O> | string): AccessorDefinition<C, P, O> {
    if (isString(accessor)) {
      // プロパティ名のみが指定されている場合はHTMLElementを前提としたアクセサーを生成
      return {
        propName: accessor,
        get: (instance) => {
          if (instance instanceof HTMLElement) {
            return instance.getAttribute(accessor);
          }
        },
        set: (instance: C, value: unknown, props: P, options: FeatureBridgeOptions<O>) => {
          if (instance instanceof HTMLElement) {
            instance.setAttribute(accessor, value as string);
          }
        },
      };
    } else {
      return accessor;
    }
  }

  /**
   * コンポーネントのインスタンスから値を取得する為のゲッター
   * @param instance コンポーネントのインスタンス
   * @param props reactのプロパティ
   * @param name 取得するプロパティ名
   * @param options オプション
   * @returns
   */
  get(instance: C, props: P, name: string, options: FeatureBridgeOptions<O>): unknown {
    const me = this,
      accessor = me._accessors[name];
    if (accessor?.get) {
      const { get, alwaysSet, convertFrom } = accessor;
      let value = get(instance, props, options);
      if (!alwaysSet) {
        me._latestState[name] = value;
      }
      let val: unknown;
      if (convertFrom) {
        val = convertFrom(instance, value, props, options);
      } else {
        val = value;
      }
      return val;
    }
  }

  /**
   * コンポーネントのインスタンスへ値を設定する為のセッター
   * @param instance コンポーネントのインスタンス
   * @param props reactのプロパティ
   * @param name 設定先のプロパティ名
   * @param value 設定する値
   * @param options オプション
   * @returns
   */
  set<V = unknown>(instance: C, props: P, name: string, value: V, options: FeatureBridgeOptions<O>): void {
    const me = this,
      accessor = me._accessors[name];
    if (accessor?.set) {
      const { deepComparison, set, validate, alwaysSet, convertTo } = accessor,
        latestValue = me._latestState[name];
      if (alwaysSet || (deepComparison && !isEqual(latestValue, value)) || latestValue !== value) {
        // 常に設定 or 値の比較で値が異なる or インスタンスが異なるの何れかの場合
        let val: unknown;
        if (convertTo) {
          val = convertTo(instance, value, props, options);
        } else {
          val = value;
        }
        if (validate && !validate(instance, val)) {
          // 入力値が不正な場合はコンポーネントのインスタンスへ反映しない
          return;
        }
        set(instance, val, props, options);
      }
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
    console.log('props is updated!!!');
  }

  /**
   * 当クラスを破棄する際の処理
   * @param bridge ブリッジ
   * @param options オプション
   */
  destructor(bridge: ComponentBridge<C, P, O>, options: FeatureBridgeOptions<O>): void {
    const me = this;
    delete me._accessors;
    delete me._latestState;
  }
}
export default AccessorBridge;
