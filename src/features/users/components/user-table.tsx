"use client";

import { useState } from "react";
import { ROLE_LABELS } from "@/shared/constants/rbac";
import { AssignRoleModal } from "@/shared/components/rbac/assign-role-modal";
import { DeleteConfirmationModal } from "@/shared/components/rbac/delete-confirmation-modal";
import { PermissionChip } from "@/shared/components/rbac/permission-chip";
import styles from "@/shared/components/rbac/rbac-components.module.scss";
import { StatusBadge } from "@/shared/components/rbac/status-badge";
import type { RbacUser } from "@/shared/types/rbac";

type UserTableProps = {
  users: RbacUser[];
};

export function UserTable({ users }: UserTableProps) {
  const [deleteUser, setDeleteUser] = useState<RbacUser | null>(null);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);

  if (users.length === 0) {
    return <div className={styles.emptyState}>No users match the selected filters.</div>;
  }

  return (
    <>
      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Organization</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Audit history</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <p className={styles.cellTitle}>{user.name}</p>
                  <p className={styles.cellMeta}>{user.email}</p>
                </td>
                <td>
                  <p className={styles.cellTitle}>{user.organizationName}</p>
                  {user.schoolName ? <p className={styles.cellMeta}>{user.schoolName}</p> : null}
                </td>
                <td>
                  <div className={styles.permissionList}>
                    {user.roleCodes.map((roleCode) => (
                      <PermissionChip code={ROLE_LABELS[roleCode]} key={roleCode} />
                    ))}
                  </div>
                </td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td>
                  <p className={styles.cellTitle}>{user.auditHistory[0]?.action}</p>
                  <p className={styles.cellMeta}>{user.auditHistory[0]?.actorName}</p>
                </td>
                <td>
                  <div className={styles.actionGroup}>
                    <button className={styles.iconButton} type="button">
                      Edit
                    </button>
                    <button
                      className={styles.iconButton}
                      type="button"
                      onClick={() => setAssignRoleOpen(true)}
                    >
                      Assign role
                    </button>
                    <button
                      className={styles.iconButton}
                      type="button"
                      onClick={() => setDeleteUser(user)}
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
      <AssignRoleModal isOpen={assignRoleOpen} onClose={() => setAssignRoleOpen(false)} />
      <DeleteConfirmationModal
        entityName={deleteUser?.name ?? "user"}
        isOpen={Boolean(deleteUser)}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => setDeleteUser(null)}
      />
    </>
  );
}
