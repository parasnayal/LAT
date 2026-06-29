"use client";

import { useMemo, useState } from "react";
import { RBAC_PERMISSIONS } from "@/shared/constants/rbac";
import type { PermissionCode } from "@/shared/types/rbac";
import { useClientPermissions } from "@/shared/utils/permissions";
import { CurriculumFilters } from "./CurriculumFilters";
import { CurriculumForm } from "./CurriculumForm";
import { CurriculumHeader } from "./CurriculumHeader";
import { CurriculumTable } from "./CurriculumTable";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { LoadingSkeleton } from "./LoadingSkeleton";
import type { SelectOption } from "./selects";
import styles from "./curriculum.module.scss";
import { useCurriculumEntity } from "../hooks/useCurriculumEntity";
import type {
  CurriculumEntity,
  CurriculumEntityKind,
  CurriculumFormValues,
  CurriculumListParams
} from "../types/curriculum.types";

type CurriculumEntityPageProps = {
  kind: CurriculumEntityKind;
  title: string;
  description: string;
  createLabel: string;
  requiresCompetencyPermission?: boolean;
  showGradeFilter?: boolean;
  showSubjectFilter?: boolean;
  showChapterFilter?: boolean;
};

const pageSize = 8;

export function CurriculumEntityPage({
  kind,
  title,
  description,
  createLabel,
  requiresCompetencyPermission,
  showGradeFilter,
  showSubjectFilter,
  showChapterFilter
}: CurriculumEntityPageProps) {
  const [filters, setFilters] = useState<CurriculumListParams>({ page: 1, pageSize });
  const [editingRecord, setEditingRecord] = useState<CurriculumEntity | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<CurriculumEntity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { can } = useClientPermissions();
  const entityQuery = useCurriculumEntity(kind, filters);
  const gradesQuery = useCurriculumEntity("grades", { page: 1, pageSize: 100 });
  const subjectsQuery = useCurriculumEntity("subjects", {
    page: 1,
    pageSize: 100,
    gradeId: filters.gradeId
  });
  const chaptersQuery = useCurriculumEntity("chapters", {
    page: 1,
    pageSize: 100,
    gradeId: filters.gradeId,
    subjectId: filters.subjectId
  });
  const topicsQuery = useCurriculumEntity("topics", {
    page: 1,
    pageSize: 100,
    chapterId: filters.chapterId
  });
  const outcomesQuery = useCurriculumEntity("learning-outcomes", { page: 1, pageSize: 100 });
  const indicatorsQuery = useCurriculumEntity("learning-indicators", { page: 1, pageSize: 100 });
  const permissionPrefix = requiresCompetencyPermission ? "competency" : "curriculum";
  const createPermission = `${permissionPrefix}.create` as PermissionCode;
  const updatePermission = `${permissionPrefix}.update` as PermissionCode;
  const deletePermission = `${permissionPrefix}.delete` as PermissionCode;
  const canCreate = can(createPermission);
  const canUpdate = can(updatePermission);
  const canDelete = can(deletePermission);

  const gradeOptions = useOptions(gradesQuery.data?.items);
  const subjectOptions = useOptions(subjectsQuery.data?.items);
  const chapterOptions = useOptions(chaptersQuery.data?.items);
  const topicOptions = useOptions(topicsQuery.data?.items);
  const learningOutcomeOptions = useOptions(outcomesQuery.data?.items);
  const learningIndicatorOptions = useOptions(indicatorsQuery.data?.items);
  const data = entityQuery.data;
  const page = data?.page ?? filters.page ?? 1;
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  async function submitForm(values: CurriculumFormValues) {
    if (editingRecord) {
      await entityQuery.update({ id: editingRecord.id, payload: values });
    } else {
      await entityQuery.create(values);
    }

    setIsFormOpen(false);
    setEditingRecord(null);
  }

  async function confirmDelete() {
    if (!deletingRecord) {
      return;
    }

    await entityQuery.remove(deletingRecord.id);
    setDeletingRecord(null);
  }

  return (
    <section className={styles.page}>
      <CurriculumHeader
        title={title}
        description={description}
        canCreate={canCreate}
        // createLabel={createLabel}
        onCreate={() => {
          setEditingRecord(null);
          setIsFormOpen(true);
        }}
      />
      <CurriculumFilters
        filters={filters}
        onChange={setFilters}
        gradeOptions={showGradeFilter ? gradeOptions : []}
        subjectOptions={showSubjectFilter ? subjectOptions : []}
        chapterOptions={showChapterFilter ? chapterOptions : []}
      />
      {entityQuery.isLoading ? (
        <LoadingSkeleton />
      ) : (
        <CurriculumTable
          records={data?.items ?? []}
          canUpdate={canUpdate}
          canDelete={canDelete}
          onEdit={(record) => {
            setEditingRecord(record);
            setIsFormOpen(true);
          }}
          onDelete={setDeletingRecord}
        />
      )}
      <div className={styles.pagination}>
        <span>
          Page {page} of {pageCount} - {total} records
        </span>
        <div className={styles.actions}>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={page <= 1}
            onClick={() => setFilters((current) => ({ ...current, page: page - 1 }))}
          >
            Previous
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            disabled={page >= pageCount}
            onClick={() => setFilters((current) => ({ ...current, page: page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>
      <CurriculumForm
        kind={kind}
        title={editingRecord ? `Edit ${title}` : createLabel}
        isOpen={isFormOpen}
        isSubmitting={entityQuery.isMutating}
        initialValue={editingRecord}
        gradeOptions={gradeOptions}
        subjectOptions={subjectOptions}
        chapterOptions={chapterOptions}
        topicOptions={topicOptions}
        learningOutcomeOptions={learningOutcomeOptions}
        learningIndicatorOptions={learningIndicatorOptions}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={submitForm}
      />
      <DeleteConfirmationModal
        name={deletingRecord?.name ?? "record"}
        isOpen={Boolean(deletingRecord)}
        isDeleting={entityQuery.isMutating}
        onCancel={() => setDeletingRecord(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

function useOptions(records?: CurriculumEntity[]) {
  return useMemo<SelectOption[]>(
    () =>
      records?.map((record) => ({
        value: record.id,
        label: record.name
      })) ?? [],
    [records]
  );
}

export const curriculumPermissions = RBAC_PERMISSIONS;
