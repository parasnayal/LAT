import { CurriculumEntityPage } from "@/features/curriculum";

export default function SubjectsPage() {
  return (
    <CurriculumEntityPage
      kind="subjects"
      title="Subjects"
      description="Create subjects and map each subject with the applicable grade."
      createLabel="Create subject"
      showGradeFilter
    />
  );
}
