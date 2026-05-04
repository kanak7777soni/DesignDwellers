'use client';

import {
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type UIEvent,
} from 'react';

type UsePagedScrollerOptions = {
  itemCount: number;
  getStep?: (element: HTMLElement) => number;
};

export function usePagedScroller({ itemCount, getStep }: UsePagedScrollerOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    didDrag: false,
    isDragging: false,
    pointerId: -1,
    scrollLeft: 0,
    startX: 0,
  });
  const suppressClickRef = useRef(false);
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

  const finishPointerDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;

      if (!drag.isDragging) {
        return;
      }

      drag.isDragging = false;

      if (event.currentTarget.hasPointerCapture(drag.pointerId)) {
        event.currentTarget.releasePointerCapture(drag.pointerId);
      }

      if (drag.didDrag) {
        const nextIndex = getSafeIndex(Math.round(event.currentTarget.scrollLeft / getScrollStep(event.currentTarget)));
        suppressClickRef.current = true;
        scrollToIndex(nextIndex);
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    },
    [getSafeIndex, getScrollStep, scrollToIndex],
  );

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }

    dragRef.current = {
      didDrag: false,
      isDragging: true,
      pointerId: event.pointerId,
      scrollLeft: event.currentTarget.scrollLeft,
      startX: event.clientX,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag.isDragging || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;

    if (Math.abs(deltaX) > 3) {
      drag.didDrag = true;
      event.preventDefault();
    }

    event.currentTarget.scrollLeft = drag.scrollLeft - deltaX;
  }, []);

  const handleClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }, []);

  return {
    activeIndex: getSafeIndex(activeIndex),
    handleClickCapture,
    handlePointerCancel: finishPointerDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: finishPointerDrag,
    handleScroll,
    scrollRef,
    scrollToIndex,
  };
}
