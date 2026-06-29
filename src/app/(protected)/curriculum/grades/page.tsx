import { CurriculumEntityPage } from "@/features/curriculum";

export default function GradesPage() {
  return (
    <CurriculumEntityPage
      kind="grades"
      title="Grades"
      description="Manage Grade 3, Grade 6, Grade 9, and future grade levels used in LAT assessment workflows."
      createLabel="Create grade"
    />
  );
}
