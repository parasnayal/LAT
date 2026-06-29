# Curriculum Management Frontend

This module implements the PARAKH LAT curriculum and competency mapping frontend only. It assumes
the backend APIs already exist.

## Routes

```txt
/curriculum
/curriculum/grades
/curriculum/subjects
/curriculum/chapters
/curriculum/topics
/curriculum/learning-outcomes
/curriculum/learning-indicators
/curriculum/competencies
/curriculum/mapping
```

## Feature Structure

```txt
src/features/curriculum/
+-- components/
|   +-- CurriculumDashboard.tsx
|   +-- CurriculumEntityPage.tsx
|   +-- CurriculumTable.tsx
|   +-- CurriculumForm.tsx
|   +-- CurriculumHeader.tsx
|   +-- CurriculumFilters.tsx
|   +-- MappingTree.tsx
|   +-- DeleteConfirmationModal.tsx
|   +-- StatusBadge.tsx
|   +-- EmptyState.tsx
|   +-- LoadingSkeleton.tsx
|   +-- selects.tsx
|   +-- curriculum.module.scss
+-- hooks/
|   +-- useGrades.ts
|   +-- useSubjects.ts
|   +-- useChapters.ts
|   +-- useTopics.ts
|   +-- useLearningOutcomes.ts
|   +-- useLearningIndicators.ts
|   +-- useCompetencies.ts
|   +-- useCurriculumMapping.ts
|   +-- useCurriculumSummary.ts
+-- schemas/
|   +-- curriculum.schema.ts
+-- services/
|   +-- curriculumApi.ts
+-- types/
|   +-- curriculum.types.ts
```

## API Integration

`src/shared/lib/axiosClient.ts` uses `NEXT_PUBLIC_API_BASE_URL`, attaches a bearer token from
storage/cookies, sends credentials, and redirects to login on `401`.

`src/features/curriculum/services/curriculumApi.ts` maps to these prepared backend endpoints:

```txt
/grades
/subjects
/chapters
/topics
/learning-outcomes
/learning-indicators
/competencies
/curriculum-mapping
```

## Permissions

The frontend checks permission codes, not role names:

```txt
curriculum.view
curriculum.create
curriculum.update
curriculum.delete
competency.view
competency.create
competency.update
competency.delete
```

Route protection is configured in `src/shared/constants/route-policies.ts` and enforced by
`src/proxy.ts`. Action visibility is handled client-side by `src/shared/utils/permissions.ts`.
