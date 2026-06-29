"use client";

import { RBAC_PERMISSIONS } from "@/shared/constants/rbac";
import { useClientPermissions } from "@/shared/utils/permissions";
import { CurriculumHeader } from "./CurriculumHeader";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { MappingTree } from "./MappingTree";
import styles from "./curriculum.module.scss";
import { useCurriculumMapping } from "../hooks/useCurriculumMapping";
import type { CurriculumMappingNode } from "../types/curriculum.types";

const fallbackMapping: CurriculumMappingNode[] = [
  {
    id: "grade-3",
    label: "Grade 3",
    type: "grade",
    children: [
      {
        id: "english",
        label: "English",
        type: "subject",
        children: [
          {
            id: "reading",
            label: "Reading comprehension",
            type: "chapter",
            children: [
              {
                id: "locate-info-topic",
                label: "Locate explicit information",
                type: "topic",
                children: [
                  {
                    id: "lo-reading",
                    label: "Learner identifies key details in a short passage",
                    type: "learningOutcome",
                    children: [
                      {
                        id: "li-reading",
                        label: "Finds who, what, when, and where from text",
                        type: "learningIndicator",
                        children: [
                          { id: "comp-locate", label: "Locate Information", type: "competency" }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export function CurriculumMappingPage() {
  const mappingQuery = useCurriculumMapping();
  const { can } = useClientPermissions();
  const canUpdate = can(RBAC_PERMISSIONS.curriculumUpdate);
  const nodes = mappingQuery.data?.length ? mappingQuery.data : fallbackMapping;

  return (
    <section className={styles.page}>
      <CurriculumHeader
        title="Curriculum Mapping"
        description="Visualize the complete path required for future question generation: Grade to Subject to Chapter to Topic to Learning Outcome to Learning Indicator to Competency."
      />
      {mappingQuery.isLoading ? <LoadingSkeleton /> : <MappingTree nodes={nodes} />}
      {canUpdate ? (
        <button
          className={styles.button}
          type="button"
          disabled={mappingQuery.isSaving}
          onClick={() => mappingQuery.saveMapping(nodes)}
        >
          {mappingQuery.isSaving ? "Saving..." : "Save mapping"}
        </button>
      ) : null}
    </section>
  );
}
