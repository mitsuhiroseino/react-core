import { AdapterFeatureOptions } from '../features';
import { AccessorAdapter } from '../features/accessor';
import { EffectAdapter } from '../features/effect';
import { EventAdapter } from '../features/event';
import AdapterDefinition from './AdapterDefinition';
import AdapterOptions from './AdapterOptions';
import AdapterProps from './AdapterProps';

const _DESTRUCTOR = <C, O>(instance: C, options?: O) => {
  if (instance instanceof HTMLElement) {
    if (instance.remove) {
      instance.remove();
    }
  }
};

/**
 * コンポーネントのプロパティをReactのステートに連携する為のクラス
 * コンポーネントから取得できるプロパティは、メソッドの実行毎に異なるインスタンスを返すものもある為、
 * 単純にReactのステートと連携をすると取得と設定の無限ループになる場合がある。
 * 当クラスでは前回取得したインスタンスと同じインスタンスを設定しようとした場合は、設定処理を実行しないという制御を行う。
 */
class Adapter<C = HTMLElement, P extends AdapterProps<C> = AdapterProps<C>, O = AdapterOptions> {
  /**
   * コンポーネントのインスタンス
   */
  private _instance: C;

  get instance(): C {
    return this._instance;
  }

  /**
   * アダプター定義
   */
  private _definition: AdapterDefinition<C, P, O>;

  /**
   * 初期化済みか
   */
  isInitialized: boolean = false;

  /**
   * 破棄済みか
   */
  isDestroyed: boolean = false;

  /**
   * React側から渡されたプロパティ
   */
  private _props: P;

  set props(props: P) {
    this._props = { ...props };
  }

  get props(): P {
    return this._props;
  }

  /**
   * アダプターの各機能
   */
  private _features: {
    accessor: AccessorAdapter<C, P, O>;
    effect: EffectAdapter<C, P, O>;
    event: EventAdapter<C, P, O>;
  };

  /**
   * デストラクターの委譲先
   */
  private _destructor?: (instance: C, options?: AdapterFeatureOptions<O>) => void;

  /**
   * コンストラクター
   * @param instance コンポーネントのインスタンス
   * @param definition アダプターの定義
   * @param props Reactのプロパティ
   * @param options アダプターのオプション
   */
  constructor(instance: C, definition: AdapterDefinition<C, P, O>, props: P, options?: O) {
    const me = this,
      { destructor = _DESTRUCTOR } = definition;

    // インスタンスと定義を持っておく
    me._instance = instance;
    me._definition = definition;

    // インスタンス固有の処理を設定
    me._destructor = destructor;

    // 各機能の作成
    me._features = {
      // アクセサー
      accessor: new AccessorAdapter(definition),
      // エフェクト
      effect: new EffectAdapter(definition),
      // イベントハンドラー
      event: new EventAdapter(definition),
    };

    // 初回分のpropsで初期化
    me.update(props, options);
    me.isInitialized = true;
  }

  /**
   * プロパティ更新
   * @param props Reactのプロパティ
   * @param options アダプターのオプション
   */
  update(props: P, options?: O): void {
    const me = this,
      featureOptions = me._getFeatureOptions(options),
      newProps = { ...props },
      oldProps = { ...me.props };

    // featureに反映
    Object.values(me._features).forEach((feature) => feature.update(me, newProps, oldProps, featureOptions));

    // propsを更新
    me._props = newProps;
  }

  /**
   * コンポーネントのインスタンスから値を取得する為のゲッター
   * @param name プロパティ名
   * @param options オプション
   * @returns
   */
  get(name: string, options?: O): unknown {
    const me = this;
    return me._features.accessor.get(me.instance, me.props, name, me._getFeatureOptions(options));
  }

  /**
   * コンポーネントのインスタンスへ値を設定する為のセッター
   * @param name プロパティ名
   * @param value 値
   * @param options オプション
   * @returns
   */
  set<V = unknown>(name: string, value: V, options?: O): void {
    const me = this;
    me._features.accessor.set(me.instance, me.props, name, value, me._getFeatureOptions(options));
  }

  /**
   * イベントリスナーの設定
   * @param eventName イベント名
   * @param handler Reactのハンドラー
   * @param options オプション
   */
  on(eventName: string, handler?: (...args: any[]) => void | any, options?: O): void {
    const me = this;
    me._features.event.on(me, eventName, handler, me._getFeatureOptions(options));
  }

  /**
   * イベントリスナーの削除
   * @param eventName イベント名
   * @param listener イベントリスナー
   * @param options オプション
   */
  un(eventName: string, options?: O): void {
    const me = this;
    me._features.event.un(me, eventName, me._getFeatureOptions(options));
  }

  destructor(options?: O): void {
    const me = this,
      featureOptions = me._getFeatureOptions(options);
    // 各機能のdestructorを実行
    Object.values(me._features).forEach((feature) => feature.destructor(me, featureOptions));
    // インスタンスのデストラクターがある場合は実行
    me._destructor(me.instance, featureOptions);
    // 念のために削除しておく
    delete me._definition;
    delete me._props;
    delete me._features;
    delete me._destructor;
    delete me._instance;
    // 破棄済みフラグtrue
    me.isDestroyed = true;
  }

  private _getFeatureOptions(options?: O): AdapterFeatureOptions<O> {
    return { ...options, adapter: this };
  }
}
export default Adapter;
