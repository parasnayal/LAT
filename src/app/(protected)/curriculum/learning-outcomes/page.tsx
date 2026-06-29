import { CurriculumEntityPage } from "@/features/curriculum";

export default function LearningOutcomesPage() {
  return (
    <CurriculumEntityPage
      kind="learning-outcomes"
      title="Learning Outcomes"
      description="Define what learners should know or be able to do, mapped to grade, subject, chapter, and optional topic."
      createLabel="Create learning outcome"
      showGradeFilter
      showSubjectFilter
      showChapterFilter
    />
  );
}
