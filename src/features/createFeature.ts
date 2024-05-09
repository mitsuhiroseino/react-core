import { Feature, FeatureConfig } from './types';

export default function createFeature<P>(config: FeatureConfig<P>) {
  const { deps = [], props = {}, ...rest } = config;
  const feature: Feature<P> = {
    ...rest,
    deps,
    depMap: deps.reduce((result, dep) => {
      result[dep.name] = dep;
      return result;
    }, {}),
    props: deps.reduce(
      (result, dep) => {
        Object.assign(result, dep.props);
        return result;
      },
      { ...props } as P,
    ),
  };
  return feature;
}
