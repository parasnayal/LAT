import { CurriculumEntityPage } from "@/features/curriculum";

export default function LearningIndicatorsPage() {
  return (
    <CurriculumEntityPage
      kind="learning-indicators"
      title="Learning Indicators"
      description="Create measurable indicators under learning outcomes for review and assessment alignment."
      createLabel="Create learning indicator"
    />
  );
}
