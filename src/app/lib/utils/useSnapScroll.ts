'use client';

import { useEffect, useRef } from 'react';

interface UseSnapScrollOptions {
  sectionIds: string[];
}

const SNAP_TRIGGER = 0.1;

export function useSnapScroll({ sectionIds }: UseSnapScrollOptions): void {
  const isSnapping = useRef<boolean>(false);

  useEffect(() => {
    const sections: HTMLElement[] = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const snapTo = (target: HTMLElement): void => {
      isSnapping.current = true;
      target.scrollIntoView({ behavior: 'smooth' });

      const release = (): void => {
        if (Math.abs(target.getBoundingClientRect().top) < 10) {
          isSnapping.current = false;
          window.removeEventListener('scroll', release);
        }
      };

      window.addEventListener('scroll', release, { passive: true });
    };

    // TODO: Do not snap when scrolling inside the triggers
    const handleWheel = (e: WheelEvent): void => {
      if (isSnapping.current) return;

      const viewportHeight: number = window.innerHeight;

      if (e.deltaY > 0) {
        for (let i = 0; i < sections.length - 1; i++) {
          const rect = sections[i].getBoundingClientRect();

          if (rect.top < -(viewportHeight * SNAP_TRIGGER)
              && rect.bottom > 0
              && rect.bottom <= viewportHeight) {
            snapTo(sections[i + 1]);
            break;
          }
        }
      } else if (e.deltaY < 0) {
        for (let i = sections.length - 1; i >= 0; i--) {
          const rect = sections[i].getBoundingClientRect();

          if (rect.top < 0
              && rect.bottom > 0
              && rect.bottom >= viewportHeight * SNAP_TRIGGER) {
            snapTo(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [sectionIds]);
}
