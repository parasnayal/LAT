"use client";

import { useCurriculumEntity } from "./useCurriculumEntity";
import type { CurriculumListParams } from "../types/curriculum.types";

export function useChapters(params: CurriculumListParams = {}) {
  return useCurriculumEntity("chapters", params);
}
