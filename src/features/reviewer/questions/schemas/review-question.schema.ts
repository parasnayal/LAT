import { z } from "zod";

export const reviewerCommentSchema = z.object({
  reviewerComment: z.string().min(1, "Reviewer comment is required")
});

export const editQuestionSchema = z.object({
  instruction: z.string().min(1, "Instruction is required"),
  stimulus: z.string().optional(),
  question: z.string().min(1, "Question is required"),
  options: z
    .array(
      z.object({
        key: z.enum(["A", "B", "C", "D"]),
        text: z.string().min(1, "Option text is required")
      })
    )
    .length(4),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  explanation: z.string().min(1, "Explanation is required"),
  learningOutcome: z.string().min(1, "Learning outcome is required"),
  competency: z.string().min(1, "Competency is required")
});

export type ReviewerCommentValues = z.infer<typeof reviewerCommentSchema>;
export type EditQuestionSchemaValues = z.infer<typeof editQuestionSchema>;
