"use client";

import { useCurriculumEntity } from "./useCurriculumEntity";
import type { CurriculumListParams } from "../types/curriculum.types";

export function useCompetencies(params: CurriculumListParams = {}) {
  return useCurriculumEntity("competencies", params);
}
