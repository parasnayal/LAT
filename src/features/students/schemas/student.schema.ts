import { z } from "zod";

export const studentSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  region: z.string().min(1, "Region is required"),
  school: z.string().min(1, "School is required"),
  schoolId: z.number().min(1, "School is required"),
  grade: z.string().min(1, "Grade is required"),
  gradeId: z.number().min(1, "Grade is required"),
  subject: z.string().optional(),
  subjectId: z.number().optional(),
  mobileNumber: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{10}$/.test(value), "Mobile number must be 10 digits"),
  rollNumber: z.string().min(1, "Roll number is required")
});

export type StudentFormValues = z.infer<typeof studentSchema>;
