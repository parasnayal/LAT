"use client";

import { useCurriculumEntity } from "./useCurriculumEntity";
import type { CurriculumListParams } from "../types/curriculum.types";

export function useTopics(params: CurriculumListParams = {}) {
  return useCurriculumEntity("topics", params);
}
