"use client";

import { useCurriculumEntity } from "./useCurriculumEntity";
import type { CurriculumListParams } from "../types/curriculum.types";

export function useLearningOutcomes(params: CurriculumListParams = {}) {
  return useCurriculumEntity("learning-outcomes", params);
}
