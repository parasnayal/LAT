import { CurriculumEntityPage } from "@/features/curriculum";

export default function CompetenciesPage() {
  return (
    <CurriculumEntityPage
      kind="competencies"
      title="Competencies"
      description="Map competencies with grade, subject, learning outcome, and learning indicator for future AI question generation."
      createLabel="Create competency"
      requiresCompetencyPermission
      showGradeFilter
      showSubjectFilter
    />
  );
}
