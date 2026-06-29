import { z } from "zod";
import type { CurriculumEntityKind } from "../types/curriculum.types";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"], {
    message: "Status is required"
  }),
  gradeId: z.string().optional(),
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
  topicId: z.string().optional(),
  learningOutcomeId: z.string().optional(),
  learningIndicatorId: z.string().optional()
});

export function getCurriculumSchema(kind: CurriculumEntityKind) {
  return baseSchema.superRefine((values, context) => {
    if (
      ["subjects", "chapters", "topics", "learning-outcomes", "competencies"].includes(kind) &&
      !values.gradeId
    ) {
      context.addIssue({ code: "custom", path: ["gradeId"], message: "Grade is required" });
    }

    if (
      ["chapters", "topics", "learning-outcomes", "competencies"].includes(kind) &&
      !values.subjectId
    ) {
      context.addIssue({ code: "custom", path: ["subjectId"], message: "Subject is required" });
    }

    if (["topics", "learning-outcomes"].includes(kind) && !values.chapterId) {
      context.addIssue({ code: "custom", path: ["chapterId"], message: "Chapter is required" });
    }

    if (kind === "learning-indicators" && !values.learningOutcomeId) {
      context.addIssue({
        code: "custom",
        path: ["learningOutcomeId"],
        message: "Learning outcome is required"
      });
    }

    if (kind === "competencies") {
      if (!values.learningOutcomeId) {
        context.addIssue({
          code: "custom",
          path: ["learningOutcomeId"],
          message: "Learning outcome is required"
        });
      }

      if (!values.learningIndicatorId) {
        context.addIssue({
          code: "custom",
          path: ["learningIndicatorId"],
          message: "Learning indicator is required"
        });
      }
    }
  });
}

export type CurriculumSchemaValues = z.infer<typeof baseSchema>;
