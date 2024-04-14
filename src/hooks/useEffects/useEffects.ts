import clone from 'lodash/clone';
import concat from 'lodash/concat';
import size from 'lodash/size';
import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

type Destructor = Exclude<ReturnType<EffectCallback>, void>;

/**
 * 可変長のuseEffect
 * @param effects
 */
export default function useEffects(effects: [EffectCallback, DependencyList?][]) {
  // 前回のeffectsのdeps
  const depsRef = useRef<DependencyList[]>(),
    // useEffect用のdeps
    dependencies = effects.reduce<unknown[]>((result, [, deps = []]) => {
      return concat(result, deps);
    }, []);
  useEffect(() => {
    const prevDeps = depsRef.current,
      destructors: Destructor[] = [];
    // 今回のdepsは次回用に保存
    depsRef.current = effects.map((effect, index) => {
      // 前回とdepsの内容に違いがある場合は関数を実行する
      const [fn, deps = []] = effect,
        prev = prevDeps ? prevDeps[index] : [];
      if (!prevDeps || size(deps) !== size(prev) || deps.some((dep, i) => dep !== prev[i])) {
        // 初回 or depsが前回と異なる場合
        const destructor = fn();
        if (destructor) {
          destructors.push(destructor);
        }
      }
      // 今回のdepsはrefに保存
      return clone(deps);
    });
    return () => {
      // destructorを実行
      destructors.forEach((destructor) => destructor());
    };
  }, dependencies);
}
