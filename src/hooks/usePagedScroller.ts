'use client';

import { useCallback, useRef, useState, type UIEvent, type WheelEvent } from 'react';

type UsePagedScrollerOptions = {
  itemCount: number;
  getStep?: (element: HTMLElement) => number;
};

export function usePagedScroller({ itemCount, getStep }: UsePagedScrollerOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getScrollStep = useCallback(
    (element: HTMLElement) => getStep?.(element) || element.clientWidth || 1,
    [getStep],
  );

  const getSafeIndex = useCallback(
    (index: number) => Math.min(Math.max(index, 0), Math.max(itemCount - 1, 0)),
    [itemCount],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const element = scrollRef.current;
      const safeIndex = getSafeIndex(index);

      setActiveIndex(safeIndex);

      if (!element) {
        return;
      }

      element.scrollTo({
        left: getScrollStep(element) * safeIndex,
        behavior: 'smooth',
      });
    },
    [getSafeIndex, getScrollStep],
  );

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;
      const nextIndex = getSafeIndex(Math.round(element.scrollLeft / getScrollStep(element)));

      setActiveIndex(nextIndex);
    },
    [getSafeIndex, getScrollStep],
  );

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }

    event.currentTarget.scrollBy({
      left: event.deltaY,
      behavior: 'smooth',
    });
  }, []);

  return {
    activeIndex: getSafeIndex(activeIndex),
    handleScroll,
    handleWheel,
    scrollRef,
    scrollToIndex,
  };
}
