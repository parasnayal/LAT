import {
  BarChart3,
  BookMarked,
  BookOpenCheck,
  ClipboardList,
  FileQuestion,
  Gauge,
  GraduationCap,
  KeyRound,
  Layers3,
  LibraryBig,
  Network,
  Settings,
  ShieldCheck,
  Tags,
  Users
} from "lucide-react";
import { RBAC_PERMISSIONS } from "@/shared/constants/rbac";
import { ROUTES } from "@/shared/constants/routes";
import type { PermissionCode, RoleCode } from "@/shared/types/rbac";

export type NavigationItem = {
  label: string;
  href: string;
  icon: typeof Gauge;
  requiredPermissions?: PermissionCode[];
  allowedRoles?: RoleCode[];
};

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: Gauge },
  {
    label: "Users",
    href: ROUTES.users,
    icon: Users,
    requiredPermissions: [RBAC_PERMISSIONS.userView]
  },
  {
    label: "Role Management",
    href: ROUTES.roles,
    icon: ShieldCheck,
    requiredPermissions: [RBAC_PERMISSIONS.roleView]
  },
  // {
  //   label: "Permissions",
  //   href: ROUTES.permissions,
  //   icon: KeyRound,
  //   requiredPermissions: [RBAC_PERMISSIONS.permissionView]
  // },
  {
    label: "Curriculum",
    href: "/curriculum",
    icon: BookOpenCheck,
    requiredPermissions: [RBAC_PERMISSIONS.curriculumView]
  },
  // {
  //   label: "Learning Outcomes",
  //   href: "/curriculum/learning-outcomes",
  //   icon: Layers3,
  //   requiredPermissions: [RBAC_PERMISSIONS.curriculumView]
  // },
  // {
  //   label: "Grades",
  //   href: "/curriculum/grades",
  //   icon: GraduationCap,
  //   requiredPermissions: [RBAC_PERMISSIONS.curriculumView]
  // },
  // {
  //   label: "Subjects",
  //   href: "/curriculum/subjects",
  //   icon: BookMarked,
  //   requiredPermissions: [RBAC_PERMISSIONS.curriculumView]
  // },
  // {
  //   label: "Chapters",
  //   href: "/curriculum/chapters",
  //   icon: LibraryBig,
  //   requiredPermissions: [RBAC_PERMISSIONS.curriculumView]
  // },
  // {
  //   label: "Topics",
  //   href: "/curriculum/topics",
  //   icon: Tags,
  //   requiredPermissions: [RBAC_PERMISSIONS.curriculumView]
  // },
  // {
  //   label: "Learning Indicators",
  //   href: "/curriculum/learning-indicators",
  //   icon: ClipboardList,
  //   requiredPermissions: [RBAC_PERMISSIONS.curriculumView]
  // },
  {
    label: "Competencies",
    href: "/curriculum/competencies",
    icon: Network,
    requiredPermissions: [RBAC_PERMISSIONS.competencyView]
  },
  {
    label: "Curriculum Mapping",
    href: "/curriculum/mapping",
    icon: Network,
    requiredPermissions: [RBAC_PERMISSIONS.competencyView]
  },
  {
    label: "Question Bank",
    href: "/questions",
    icon: FileQuestion,
    requiredPermissions: [RBAC_PERMISSIONS.questionView]
  },
  {
    label: "AI Question Generator",
    href: "/admin/question-generator",
    icon: FileQuestion,
    requiredPermissions: [RBAC_PERMISSIONS.questionGenerate]
  },
  {
    label: "Teachers",
    href: "/admin/teachers",
    icon: Users,
    requiredPermissions: [RBAC_PERMISSIONS.teacherManage]
  },
  {
    label: "Students",
    href: "/teacher/students",
    icon: GraduationCap,
    requiredPermissions: [RBAC_PERMISSIONS.studentCreate],
    allowedRoles: ["teacher"]
  },
  {
    label: "My Assessment",
    href: "/student/test/demo-assessment",
    icon: ClipboardList,
    requiredPermissions: [RBAC_PERMISSIONS.assessmentAttempt],
    allowedRoles: ["super_admin", "student"]
  },
  {
    label: "Review Queue",
    href: "/reviewer/questions",
    icon: FileQuestion,
    requiredPermissions: [RBAC_PERMISSIONS.questionReview]
  },
  {
    label: "Assessments",
    href: "/assessments",
    icon: ClipboardList,
    requiredPermissions: [RBAC_PERMISSIONS.assessmentView]
  }
  // {
  //   label: "Analytics",
  //   href: "/analytics",
  //   icon: BarChart3,
  //   requiredPermissions: [RBAC_PERMISSIONS.analyticsView]
  // },
  // {
  //   label: "Settings",
  //   href: ROUTES.settings,
  //   icon: Settings,
  //   requiredPermissions: [RBAC_PERMISSIONS.settingsManage]
  // }
];
