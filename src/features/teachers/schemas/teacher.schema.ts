import { z } from "zod";

export const teacherSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  roleId: z.number().int().min(1, "Role is required"),
  schoolId: z.number().int().min(1, "School is required"),
  contactNumber: z.string().min(1, "Contact number is required")
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
