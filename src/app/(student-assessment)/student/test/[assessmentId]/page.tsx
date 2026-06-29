import { StudentAssessmentTestPage } from "@/features/student-test";

export default async function StudentTestRoute({
  params
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;

  return <StudentAssessmentTestPage assessmentId={assessmentId} />;
}
