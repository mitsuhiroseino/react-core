import AdapterProps from '../adapter/AdapterProps';
import { AdapterFeatureOptions } from '../features';
import { AccessorDefinition } from '../features/accessor';
import { EffectDefinition } from '../features/effect';
import { EventDefinition } from '../features/event';
import AdapterOptions from './AdapterOptions';

/**
 * コンポーネントのインスタンスとReactを連携する為の定義
 * setterに渡された値が直近のgetterで取得した値と異なるインスタンスの場合には、
 * この定義に従いコンポーネントのインスタンスへの設定を行う。
 */
type AdapterDefinition<C = HTMLElement, P extends AdapterProps<C> = AdapterProps<C>, O = AdapterOptions> = {
  /**
   * コンポーネントのインスタンスのプロパティへのアクセスに関する定義
   * ステートとして扱うプロパティはここで定義したアクセサ経由で取得・更新をする必要がある
   * 文字列でコンポーネントのプロパティ名を指定した場合は、`set${lodash/capitalizeで変換したコンポーネントのプロパティ名}`または
   * `set${lodash/capitalizeで変換したコンポーネントのプロパティ名}`を実行する定義が適用される
   */
  accessors?: (AccessorDefinition<C, P, O> | string)[];

  /**
   * Reactのプロパティの更新をトリガーとしてコンポーネントのインスタンスを操作する為の定義
   * 文字列でReactのプロパティ名を指定した場合は、対象のプロパティのアクセサーで値を設定する定義が適用される
   */
  effects?: (EffectDefinition<C, P, O> | string)[];

  /**
   * Reactのイベントハンドラをコンポーネントのイベントに連携する為の定義
   * 文字列でコンポーネントのイベント名を指定した場合は、`on${lodash/capitalizeで変換したコンポーネントのイベント名}`を実行する定義が適用される
   */
  events?: (EventDefinition<C, P, O> | string)[];

  /**
   * コンポーネントのインスタンスを新規作成する基準になるプロパティ。
   * インスタンス作成後に変更できないプロパティもある為、
   * ここに設定したプロパティが変更された際にインスタンスを新規作成する。
   * 未指定の場合は初回のみ新規作成。
   */
  recreationTriggers?: string[];

  /**
   * コンポーネントのインスタンスへイベントリスナーを設定する為の処理
   * イベントリスナーの登録方法はライブラリ毎に異なる為、その差をここで埋める
   * @param instance コンポーネントのインスタンス
   * @param eventName コンポーネントのインスタンスのイベント名
   * @param listener イベントリスナー
   * @param options オプション
   * @returns
   */
  on?: (
    instance: C,
    eventName: string,
    listener: (...args: unknown[]) => unknown,
    options?: AdapterFeatureOptions<O>,
  ) => void;

  /**
   * コンポーネントのインスタンスへイベントリスナーを解除する為の処理
   * イベントリスナーの解除方法はライブラリ毎に異なる為、その差をここで埋める
   * @param instance コンポーネントのインスタンス
   * @param eventName コンポーネントのインスタンスのイベント名
   * @param listener イベントリスナー
   * @param options オプション
   * @returns
   */
  un?: (
    instance: C,
    eventName: string,
    listener: (...args: unknown[]) => unknown,
    options?: AdapterFeatureOptions<O>,
  ) => void;

  /**
   * コンポーネントのインスタンスを破棄する前に実行する処理
   * 主にリスナーの削除やdomの破棄等が行われる必要がある
   * @param instance コンポーネントのインスタンス
   * @param options オプション
   * @returns
   */
  destructor?: (instance: C, options?: AdapterFeatureOptions<O>) => void;
};
export default AdapterDefinition;
