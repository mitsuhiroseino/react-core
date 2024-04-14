import { ExoticComponent } from 'react';

/**
 * 変数の型としてクラスコンポーネントとファンクションコンポーネント指定したい場合に使う型
 * ExoticComponentが内部用の型の為、念のためにワンクッション入れた形で利用する
 */
export type ReactComponent<P = {}> = ExoticComponent<P>;
