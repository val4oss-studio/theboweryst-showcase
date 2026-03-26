'use client';

import { useSnapScroll } from '@/app/lib/utils/useSnapScroll';
import { ORDERED_SECTIONS } from '@/config/sections';

export function SnapScroll() {
  useSnapScroll({ sectionIds: ORDERED_SECTIONS });
  return null;
}
