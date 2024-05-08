import ComponentBridge from '../../ComponentBridge';
import ComponentBridgeOptions from '../../ComponentBridgeOptions';
import ComponentBridgeProps from '../../ComponentBridgeProps';
import BridgeFeatureOptions from '../BridgeFeatureOptions';

/**
 * Reactのイベントハンドラをコンポーネントのイベントに連携する為の定義
 */
type EventDefinition<
  C = HTMLElement,
  P extends ComponentBridgeProps<C> = ComponentBridgeProps<C>,
  O extends ComponentBridgeOptions = ComponentBridgeOptions,
> = {
  /**
   * コンポーネントのイベント名
   */
  eventName: string;

  /**
   * Reactのハンドラー名
   */
  handlerName?: string;

  /**
   * Reactのハンドラをラップしたコンポーネント用のイベントリスナーを取得する為の関数。
   * @param bridge コンポーネントのインスタンスのブリッジ
   * @param handler reactのイベントハンドラ
   * @param options 任意のオプション
   * @return イベントリスナー
   */
  createListener: (
    bridge: ComponentBridge<C, P, O>,
    handler?: (...args: unknown[]) => unknown,
    options?: BridgeFeatureOptions<O>,
  ) => (...args: unknown[]) => unknown;

  /**
   * イベントリスナーの実行を同一同期処理内で後勝ちの排他処理行い非同期で実行する。
   * trueを設定した場合、設定したイベントリスナーのみで排他が行われる。
   * 文字列を指定した場合、同じ文字列を指定したイベントリスナー間で排他が行われる。
   */
  exclusive?: boolean | string;
};
export default EventDefinition;
