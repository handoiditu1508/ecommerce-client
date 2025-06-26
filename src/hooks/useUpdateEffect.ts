import { DependencyList, EffectCallback, useEffect, useState } from "react";

/**
 * Accepts a function that contains imperative, possibly effectful code.
 * Ignore first render.
 *
 * @param effect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useeffect
 */
export default function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirstRender) {
      return effect();
    }
    setIsFirstRender(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
