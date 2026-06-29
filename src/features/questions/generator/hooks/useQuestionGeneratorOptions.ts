"use client";

import { useQuery } from "@tanstack/react-query";
import { questionGeneratorApi } from "../services/questionGeneratorApi";

export function useQuestionGeneratorOptions(filters: {
  gradeId?: string;
  subjectId?: string;
  competencyId?: string;
}) {
  const grades = useQuery({
    queryKey: ["question-generator", "grades"],
    queryFn: questionGeneratorApi.getGrades
  });
  const subjects = useQuery({
    queryKey: ["question-generator", "subjects", filters.gradeId],
    queryFn: () => questionGeneratorApi.getSubjects(filters.gradeId),
    enabled: Boolean(filters.gradeId)
  });
  const competencies = useQuery({
    queryKey: ["question-generator", "competencies", filters.subjectId],
    queryFn: () => questionGeneratorApi.getCompetencies(filters.subjectId),
    enabled: Boolean(filters.subjectId)
  });
  const learningOutcomes = useQuery({
    queryKey: ["question-generator", "learning-outcomes", filters.competencyId],
    queryFn: () => questionGeneratorApi.getLearningOutcomes(filters.competencyId),
    enabled: Boolean(filters.competencyId)
  });

  return { grades, subjects, competencies, learningOutcomes };
}
