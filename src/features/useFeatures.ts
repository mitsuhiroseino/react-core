import applyIf from '@visue/core/utils/function/applyIf';
import { useMemo } from 'react';
import { Feature } from './types';

/**
 * 値を持つコンポーネントのプロパティ
 */
export function useFeatures<P = any>(props: P, features: Feature<any>[]) {
  return useMemo(() => {
    let featuredProps: P = { ...props };
    for (const feature of features) {
      featuredProps = applyIf(feature.useMemo, [featuredProps]) || featuredProps;
    }
    return featuredProps;
  }, []);
}
export default useFeatures;
