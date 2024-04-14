import { forwardRef, memo } from 'react';

export type WithPropsLogOptions = {
  // memoあり
  withMemo?: boolean;
  // logに出力する内容を取得する関数。未指定の場合はpropsを出力
  getArgs?: (props: any) => any[];
};

/**
 * propsをログに出力
 * @param ComposedComponent
 */
export default function withPropsLog(ComposedComponent: any, options: WithPropsLogOptions = {}) {
  const { withMemo, getArgs } = options,
    // ログ入りのコンポーネント
    ComponentWithLog = forwardRef(function (props: any, ref: any) {
      const logArgs = getArgs ? getArgs(props) : [props];
      console.log(...logArgs);
      return <ComposedComponent ref={ref} {...props} />;
    });
  if (withMemo) {
    // memoあり
    return memo(ComponentWithLog);
  } else {
    // memoなし
    return ComponentWithLog;
  }
}
