"use client";

import type { CurriculumEntity } from "../types/curriculum.types";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";
import styles from "./curriculum.module.scss";

type CurriculumTableProps = {
  records: CurriculumEntity[];
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (record: CurriculumEntity) => void;
  onDelete: (record: CurriculumEntity) => void;
};

function getMappings(record: CurriculumEntity) {
  const mappings = [
    "gradeName" in record ? record.gradeName : undefined,
    "subjectName" in record ? record.subjectName : undefined,
    "chapterName" in record ? record.chapterName : undefined,
    "topicName" in record ? record.topicName : undefined,
    "learningOutcomeName" in record ? record.learningOutcomeName : undefined,
    "learningIndicatorName" in record ? record.learningIndicatorName : undefined
  ].filter(Boolean);

  return mappings.length ? mappings.join(" / ") : "Root curriculum record";
}

export function CurriculumTable({
  records,
  canUpdate,
  canDelete,
  onEdit,
  onDelete
}: CurriculumTableProps) {
  if (!records.length) {
    return <EmptyState message="No curriculum records match the current search or filters." />;
  }

  return (
    <div className={styles.tableShell}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Mapping</th>
            <th>Status</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <p className={styles.title}>{record.name}</p>
                {record.description ? <p className={styles.meta}>{record.description}</p> : null}
              </td>
              <td>{record.code}</td>
              <td>{getMappings(record)}</td>
              <td>
                <StatusBadge status={record.status} />
              </td>
              <td>
                {record.updatedAt
                  ? new Date(record.updatedAt).toLocaleDateString()
                  : "Not available"}
              </td>
              <td>
                <div className={styles.actions}>
                  {canUpdate ? (
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={() => onEdit(record)}
                    >
                      Edit
                    </button>
                  ) : null}
                  {canDelete ? (
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={() => onDelete(record)}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
