import { CurriculumEntityPage } from "@/features/curriculum";

export default function TopicsPage() {
  return (
    <CurriculumEntityPage
      kind="topics"
      title="Topics"
      description="Manage topics under each chapter so assessment questions can be generated with precise context."
      createLabel="Create topic"
      showGradeFilter
      showSubjectFilter
      showChapterFilter
    />
  );
}
