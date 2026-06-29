"use client";

import { useCurriculumEntity } from "./useCurriculumEntity";
import type { CurriculumListParams } from "../types/curriculum.types";

export function useSubjects(params: CurriculumListParams = {}) {
  return useCurriculumEntity("subjects", params);
}
