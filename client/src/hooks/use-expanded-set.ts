import { useCallback, useState } from "react";

/**
 * Manages multi-open accordion state keyed by item identifier.
 */
export function useExpandedSet<T extends string = string>() {
  const [openIds, setOpenIds] = useState<Set<T>>(() => new Set());

  const isOpen = useCallback((id: T) => openIds.has(id), [openIds]);

  const toggle = useCallback((id: T) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { isOpen, toggle };
}
