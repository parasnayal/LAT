import { z } from "zod";

export const questionGenerationSchema = z.object({
  gradeId: z.string().min(1, "Grade is required"),
  subjectId: z.string().min(1, "Subject is required"),
  competencyId: z.string().min(1, "Competency is required"),
  learningOutcomeId: z.string().min(1, "Learning outcome is required"),
  difficulty: z.enum(["easy", "medium", "hard"], {
    message: "Difficulty is required"
  }),
  questionType: z.enum(["mcq"], {
    message: "Question type is required"
  }),
  totalQuestions: z.number().min(1, "Minimum questions is 1").max(5, "Maximum questions is 5"),
  language: z.enum(["english", "hindi"], {
    message: "Language is required"
  })
});

export type QuestionGenerationSchemaValues = z.infer<typeof questionGenerationSchema>;
