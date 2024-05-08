import isString from 'lodash/isString';
import ComponentBridge from '../../ComponentBridge';
import ComponentBridgeDefinition from '../../ComponentBridgeDefinition';
import ComponentBridgeOptions from '../../ComponentBridgeOptions';
import ComponentBridgeProps from '../../ComponentBridgeProps';
import BridgeFeature from '../BridgeFeature';
import BridgeFeatureOptions from '../BridgeFeatureOptions';
import EffectDefinition from './EffectDefinition';

/**
 * コンポーネントのプロパティをReactのステートに連携する為のクラス
 * コンポーネントから取得できるプロパティは、メソッドの実行毎に異なるインスタンスを返すものもある為、
 * 単純にReactのステートと連携をすると取得と設定の無限ループになる場合がある。
 * 当クラスでは前回取得したインスタンスと同じインスタンスを設定しようとした場合は、設定処理を実行しないという制御を行う。
 */
class EffectBridge<
  C = HTMLElement,
  P extends ComponentBridgeProps<C> = ComponentBridgeProps<C>,
  O extends ComponentBridgeOptions = ComponentBridgeOptions,
> implements BridgeFeature<C, P, O>
{
  /**
   * ブリッジ定義
   */
  private _definitions: EffectDefinition<C, P, O>[];

  /**
   * コンストラクター
   * @param definition ブリッジ定義
   */
  constructor(definition: ComponentBridgeDefinition<C, P, O>) {
    const me = this,
      { effects = [] } = definition,
      effectDefinitions = effects.map(me.toEffectDefinition);

    // 定義を持っておく
    me._definitions = effectDefinitions;
  }

  /**
   * プロパティ名のみの指定された定義をエフェクト定義に変換する
   * @param effect
   * @returns
   */
  private toEffectDefinition(effect: EffectDefinition<C, P, O> | string) {
    if (isString(effect)) {
      // プロパティ名のみが指定されている場合はインスタンスに対象のプロパティの値を設定するエフェクトを作成
      return {
        propNames: [effect],
        callback: (bridge, props) => {
          bridge.set(effect, props[effect]);
        },
      };
    } else {
      return effect;
    }
  }

  /**
   * プロパティ更新時の処理
   * @param bridge ブリッジ
   * @param newProps 更新後のプロパティ
   * @param oldProps 更新前のプロパティ
   * @param options オプション
   */
  update(bridge: ComponentBridge<C, P, O>, newProps: P, oldProps: P, options: BridgeFeatureOptions<O>): void {
    const me = this,
      effects = me._definitions;
    // プロパティに変更が有った場合は処理を実行
    for (const effect of effects) {
      const { propNames, callback } = effect;
      if (propNames.some((propName) => newProps[propName] !== oldProps[propName])) {
        callback(bridge, newProps, oldProps, options);
      }
    }
  }

  /**
   * 当クラスを破棄する際の処理
   * @param bridge ブリッジ
   * @param options オプション
   */
  destructor(bridge: ComponentBridge<C, P, O>, options: BridgeFeatureOptions<O>): void {
    const me = this;
    delete me._definitions;
  }
}
export default EffectBridge;
