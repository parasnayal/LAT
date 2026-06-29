"use client";

import { useCurriculumEntity } from "./useCurriculumEntity";
import type { CurriculumListParams } from "../types/curriculum.types";

export function useLearningIndicators(params: CurriculumListParams = {}) {
  return useCurriculumEntity("learning-indicators", params);
}
