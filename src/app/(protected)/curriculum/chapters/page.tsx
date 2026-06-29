import { CurriculumEntityPage } from "@/features/curriculum";

export default function ChaptersPage() {
  return (
    <CurriculumEntityPage
      kind="chapters"
      title="Chapters"
      description="Manage chapters or units for a selected grade and subject."
      createLabel="Create chapter"
      showGradeFilter
      showSubjectFilter
    />
  );
}
