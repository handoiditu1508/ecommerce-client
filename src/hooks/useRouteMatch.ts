import { useMemo } from "react";
import { matchPath, PathMatch, useLocation } from "react-router-dom";

/**
 * Hook that checks the current location's pathname against a set of patterns.
 *
 * You need to provide the routes in descendant order.
 *
 * This means that if you have nested routes like: `users`, `users/new`, `users/edit`.
 *
 * Then the order should be `['users/add', 'users/edit', 'users']`.
 * @param patterns An array of route patterns to match against.
 * @returns The match result if the current path matches any of the patterns.
 */
export default function useRouteMatch(patterns: readonly string[]) {
  const { pathname } = useLocation();
  const value = useMemo<PathMatch<string> | null>(() => {
    for (let i = 0; i < patterns.length; i += 1) {
      const pattern = patterns[i];
      const possibleMatch = matchPath(pattern, pathname);
      if (possibleMatch !== null) {
        return possibleMatch;
      }
    }

    return null;
  }, [pathname, patterns]);

  return value;
}
