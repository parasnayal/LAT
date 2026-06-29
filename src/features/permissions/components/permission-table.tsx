"use client";

import { useState } from "react";
import { DeleteConfirmationModal } from "@/shared/components/rbac/delete-confirmation-modal";
import styles from "@/shared/components/rbac/rbac-components.module.scss";
import { StatusBadge } from "@/shared/components/rbac/status-badge";
import type { Permission } from "@/shared/types/rbac";

type PermissionTableProps = {
  permissions: Permission[];
};

export function PermissionTable({ permissions }: PermissionTableProps) {
  const [deletePermission, setDeletePermission] = useState<Permission | null>(null);

  if (permissions.length === 0) {
    return <div className={styles.emptyState}>No permissions match the selected filters.</div>;
  }

  return (
    <>
      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Permission</th>
              <th>Resource</th>
              <th>Action</th>
              <th>Status</th>
              <th>Audit history</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission.id}>
                <td>
                  <p className={styles.cellTitle}>{permission.code}</p>
                  <p className={styles.cellMeta}>{permission.description}</p>
                </td>
                <td>{permission.resource}</td>
                <td>{permission.action}</td>
                <td>
                  <StatusBadge status={permission.status} />
                </td>
                <td>
                  <p className={styles.cellTitle}>{permission.auditHistory[0]?.action}</p>
                  <p className={styles.cellMeta}>{permission.auditHistory[0]?.actorName}</p>
                </td>
                <td>
                  <div className={styles.actionGroup}>
                    <button className={styles.iconButton} type="button">
                      Edit
                    </button>
                    <button
                      className={styles.iconButton}
                      type="button"
                      onClick={() => setDeletePermission(permission)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DeleteConfirmationModal
        entityName={deletePermission?.code ?? "permission"}
        isOpen={Boolean(deletePermission)}
        onClose={() => setDeletePermission(null)}
        onConfirm={() => setDeletePermission(null)}
      />
    </>
  );
}
