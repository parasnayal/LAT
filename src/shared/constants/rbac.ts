import type { PermissionCode, RoleCode } from "@/shared/types/rbac";

export const RBAC_PERMISSIONS = {
  userView: "user.view",
  userCreate: "user.create",
  userUpdate: "user.update",
  userDelete: "user.delete",
  roleView: "role.view",
  roleCreate: "role.create",
  roleUpdate: "role.update",
  roleDelete: "role.delete",
  roleAssign: "role.assign",
  permissionView: "permission.view",
  permissionCreate: "permission.create",
  permissionUpdate: "permission.update",
  permissionDelete: "permission.delete",
  permissionManage: "permission.manage",
  organizationView: "organization.view",
  organizationManage: "organization.manage",
  schoolView: "school.view",
  schoolManage: "school.manage",
  teacherManage: "teacher.manage",
  studentCreate: "student.create",
  reviewerManage: "reviewer.manage",
  curriculumView: "curriculum.view",
  curriculumCreate: "curriculum.create",
  curriculumUpdate: "curriculum.update",
  curriculumDelete: "curriculum.delete",
  curriculumUpload: "curriculum.upload",
  gradeCreate: "grade.create",
  subjectCreate: "subject.create",
  chapterCreate: "chapter.create",
  learningOutcomeManage: "learningOutcome.manage",
  learningIndicatorManage: "learningIndicator.manage",
  competencyView: "competency.view",
  competencyCreate: "competency.create",
  competencyUpdate: "competency.update",
  competencyDelete: "competency.delete",
  questionView: "question.view",
  questionGenerate: "question.generate",
  questionCreate: "question.create",
  questionReview: "question.review",
  questionApprove: "question.approve",
  questionReject: "question.reject",
  questionPublish: "question.publish",
  assessmentView: "assessment.view",
  assessmentCreate: "assessment.create",
  assessmentUpdate: "assessment.update",
  assessmentPublish: "assessment.publish",
  assessmentAssign: "assessment.assign",
  assessmentSchedule: "assessment.schedule",
  assessmentAttempt: "assessment.attempt",
  studentView: "student.view",
  reportView: "report.view",
  reportDownload: "report.download",
  analyticsView: "analytics.view",
  settingsManage: "settings.manage"
} as const satisfies Record<string, PermissionCode>;

export const ALL_PERMISSION_CODES = Object.values(RBAC_PERMISSIONS);

export const ROLE_LABELS: Record<RoleCode, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
  organization_admin: "Organization Admin",
  curriculum_manager: "Curriculum Manager",
  question_author: "Question Author",
  reviewer: "Reviewer",
  assessment_manager: "Assessment Manager",
  teacher: "Teacher",
  student: "Student",
  regional_officer: "Regional Officer"
};

export const ROLE_PERMISSION_MAP: Record<RoleCode, PermissionCode[]> = {
  admin: [...ALL_PERMISSION_CODES],
  super_admin: [...ALL_PERMISSION_CODES],
  organization_admin: [
    RBAC_PERMISSIONS.userView,
    RBAC_PERMISSIONS.userCreate,
    RBAC_PERMISSIONS.userUpdate,
    RBAC_PERMISSIONS.roleAssign,
    RBAC_PERMISSIONS.schoolView,
    RBAC_PERMISSIONS.schoolManage,
    RBAC_PERMISSIONS.teacherManage,
    RBAC_PERMISSIONS.reviewerManage,
    RBAC_PERMISSIONS.assessmentView,
    RBAC_PERMISSIONS.assessmentCreate,
    RBAC_PERMISSIONS.assessmentUpdate,
    RBAC_PERMISSIONS.assessmentPublish,
    RBAC_PERMISSIONS.reportView
  ],
  curriculum_manager: [
    RBAC_PERMISSIONS.curriculumView,
    RBAC_PERMISSIONS.curriculumCreate,
    RBAC_PERMISSIONS.curriculumUpdate,
    RBAC_PERMISSIONS.curriculumDelete,
    RBAC_PERMISSIONS.curriculumUpload,
    RBAC_PERMISSIONS.gradeCreate,
    RBAC_PERMISSIONS.subjectCreate,
    RBAC_PERMISSIONS.chapterCreate,
    RBAC_PERMISSIONS.learningOutcomeManage,
    RBAC_PERMISSIONS.learningIndicatorManage,
    RBAC_PERMISSIONS.competencyView,
    RBAC_PERMISSIONS.competencyCreate,
    RBAC_PERMISSIONS.competencyUpdate,
    RBAC_PERMISSIONS.competencyDelete,
    RBAC_PERMISSIONS.questionView
  ],
  question_author: [
    RBAC_PERMISSIONS.curriculumView,
    RBAC_PERMISSIONS.competencyView,
    RBAC_PERMISSIONS.questionView,
    RBAC_PERMISSIONS.questionGenerate,
    RBAC_PERMISSIONS.questionCreate
  ],
  reviewer: [
    RBAC_PERMISSIONS.questionView,
    RBAC_PERMISSIONS.questionReview,
    RBAC_PERMISSIONS.questionApprove,
    RBAC_PERMISSIONS.questionReject,
    RBAC_PERMISSIONS.questionPublish
  ],
  assessment_manager: [
    RBAC_PERMISSIONS.questionView,
    RBAC_PERMISSIONS.assessmentView,
    RBAC_PERMISSIONS.assessmentCreate,
    RBAC_PERMISSIONS.assessmentUpdate,
    RBAC_PERMISSIONS.assessmentPublish,
    RBAC_PERMISSIONS.assessmentAssign,
    RBAC_PERMISSIONS.assessmentSchedule
  ],
  teacher: [
    RBAC_PERMISSIONS.studentCreate,
    RBAC_PERMISSIONS.assessmentView,
    RBAC_PERMISSIONS.assessmentAssign,
    RBAC_PERMISSIONS.studentView,
    RBAC_PERMISSIONS.reportView,
    RBAC_PERMISSIONS.reportDownload
  ],
  student: [RBAC_PERMISSIONS.assessmentAttempt, RBAC_PERMISSIONS.reportView],
  regional_officer: [
    RBAC_PERMISSIONS.schoolView,
    RBAC_PERMISSIONS.studentView,
    RBAC_PERMISSIONS.reportView,
    RBAC_PERMISSIONS.analyticsView
  ]
};
