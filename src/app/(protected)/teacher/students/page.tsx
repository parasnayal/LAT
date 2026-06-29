import { cookies } from "next/headers";
import { AUTH_ROLES_COOKIE_NAME } from "@/features/auth/constants/auth.constants";
import { StudentsPage } from "@/features/students";

function parseSerializedRoles(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

export default async function TeacherStudentsRoute() {
  const cookieStore = await cookies();
  const roles = parseSerializedRoles(cookieStore.get(AUTH_ROLES_COOKIE_NAME)?.value);

  return <StudentsPage canCreateStudent={roles.includes("teacher")} />;
}
