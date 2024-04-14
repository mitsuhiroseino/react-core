import { Adapter, AdapterOptions, AdapterProps } from '../../adapter';
import AdapterFeatureOptions from '../AdapterFeatureOptions';

/**
 * Reactのイベントハンドラをコンポーネントのイベントに連携する為の定義
 */
type EventDefinition<
  C = HTMLElement,
  P extends AdapterProps<C> = AdapterProps<C>,
  O extends AdapterOptions = AdapterOptions,
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
   * @param adapter コンポーネントのインスタンスのアダプター
   * @param handler reactのイベントハンドラ
   * @param options 任意のオプション
   * @return イベントリスナー
   */
  createListener: (
    adapter: Adapter<C, P, O>,
    handler?: (...args: unknown[]) => unknown,
    options?: AdapterFeatureOptions<O>,
  ) => (...args: unknown[]) => unknown;

  /**
   * イベントリスナーの実行を同一同期処理内で後勝ちの排他処理行い非同期で実行する。
   * trueを設定した場合、設定したイベントリスナーのみで排他が行われる。
   * 文字列を指定した場合、同じ文字列を指定したイベントリスナー間で排他が行われる。
   */
  exclusive?: boolean | string;
};
export default EventDefinition;
