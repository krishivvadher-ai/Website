"use client";

import { useEffect, useState } from "react";

/**
 * Media-query hook that returns null until mounted, so callers can decide
 * what to render server-side. Used to keep the mobile tab bar out of the DOM
 * entirely on desktop rather than hiding it with CSS.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useIsDesktop(): boolean | null {
  return useMediaQuery("(min-width: 1024px)");
}

/**
 * True after hydration. Seed event dates are generated relative to "now" at
 * module load, so any server-rendered markup derived from them can differ
 * from the client's — components that render seed dates gate on this and
 * show skeletons in the static HTML instead.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
