"use client";

import { useState } from "react";
import { AssignPermissionModal } from "@/shared/components/rbac/assign-permission-modal";
import { DeleteConfirmationModal } from "@/shared/components/rbac/delete-confirmation-modal";
import { PermissionChip } from "@/shared/components/rbac/permission-chip";
import styles from "@/shared/components/rbac/rbac-components.module.scss";
import { StatusBadge } from "@/shared/components/rbac/status-badge";
import type { Role } from "@/shared/types/rbac";

type RoleTableProps = {
  roles: Role[];
};

export function RoleTable({ roles }: RoleTableProps) {
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [assignPermissionsOpen, setAssignPermissionsOpen] = useState(false);

  if (roles.length === 0) {
    return <div className={styles.emptyState}>No roles match the selected filters.</div>;
  }

  return (
    <>
      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Role</th>
              <th>Status</th>
              <th>Permissions</th>
              <th>Users</th>
              <th>Audit history</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>
                  <p className={styles.cellTitle}>{role.name}</p>
                  <p className={styles.cellMeta}>{role.description}</p>
                </td>
                <td>
                  <StatusBadge status={role.status} />
                </td>
                <td>
                  <div className={styles.permissionList}>
                    {role.permissionCodes.slice(0, 4).map((permission) => (
                      <PermissionChip code={permission} key={permission} />
                    ))}
                    {role.permissionCodes.length > 4 ? (
                      <span className={styles.permissionChip}>
                        +{role.permissionCodes.length - 4}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td>{role.userCount}</td>
                <td>
                  <p className={styles.cellTitle}>{role.auditHistory[0]?.action}</p>
                  <p className={styles.cellMeta}>{role.auditHistory[0]?.actorName}</p>
                </td>
                <td>
                  <div className={styles.actionGroup}>
                    <button className={styles.iconButton} type="button">
                      Edit
                    </button>
                    <button
                      className={styles.iconButton}
                      type="button"
                      onClick={() => setAssignPermissionsOpen(true)}
                    >
                      Permissions
                    </button>
                    <button
                      className={styles.iconButton}
                      type="button"
                      onClick={() => setDeleteRole(role)}
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
      <AssignPermissionModal
        isOpen={assignPermissionsOpen}
        onClose={() => setAssignPermissionsOpen(false)}
      />
      <DeleteConfirmationModal
        entityName={deleteRole?.name ?? "role"}
        isOpen={Boolean(deleteRole)}
        onClose={() => setDeleteRole(null)}
        onConfirm={() => setDeleteRole(null)}
      />
    </>
  );
}
