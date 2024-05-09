import ComponentBridgeDefinition from './ComponentBridgeDefinition';
import ComponentBridgeOptions from './ComponentBridgeOptions';
import ComponentBridgeProps from './ComponentBridgeProps';
import FeatureBridgeOptions from './features/FeatureBridgeOptions';
import AccessorBridge from './features/accessor/AccessorBridge';
import EffectBridge from './features/effect/EffectBridge';
import EventBridge from './features/event/EventBridge';

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
class ComponentBridge<
  C = HTMLElement,
  P extends ComponentBridgeProps<C> = ComponentBridgeProps<C>,
  O = ComponentBridgeOptions,
> {
  /**
   * コンポーネントのインスタンス
   */
  private _instance: C;

  get instance(): C {
    return this._instance;
  }

  /**
   * ブリッジ定義
   */
  private _definition: ComponentBridgeDefinition<C, P, O>;

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
   * ブリッジの各機能
   */
  private _features: {
    accessor: AccessorBridge<C, P, O>;
    effect: EffectBridge<C, P, O>;
    event: EventBridge<C, P, O>;
  };

  /**
   * デストラクターの委譲先
   */
  private _destructor?: (instance: C, options?: FeatureBridgeOptions<O>) => void;

  /**
   * コンストラクター
   * @param instance コンポーネントのインスタンス
   * @param definition ブリッジの定義
   * @param props Reactのプロパティ
   * @param options ブリッジのオプション
   */
  constructor(instance: C, definition: ComponentBridgeDefinition<C, P, O>, props: P, options?: O) {
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
      accessor: new AccessorBridge(definition),
      // エフェクト
      effect: new EffectBridge(definition),
      // イベントハンドラー
      event: new EventBridge(definition),
    };

    // 初回分のpropsで初期化
    me.update(props, options);
    me.isInitialized = true;
  }

  /**
   * プロパティ更新
   * @param props Reactのプロパティ
   * @param options ブリッジのオプション
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

  private _getFeatureOptions(options?: O): FeatureBridgeOptions<O> {
    return { ...options, bridge: this };
  }
}
export default ComponentBridge;
