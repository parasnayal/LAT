"use client";

import { useCurriculumEntity } from "./useCurriculumEntity";
import type { CurriculumListParams } from "../types/curriculum.types";

export function useGrades(params: CurriculumListParams = {}) {
  return useCurriculumEntity("grades", params);
}
