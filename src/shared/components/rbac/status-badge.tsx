import type { EntityStatus, RbacUser } from "@/shared/types/rbac";
import styles from "./rbac-components.module.scss";

type StatusBadgeProps = {
  status: EntityStatus | RbacUser["status"];
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const className =
    status === "active"
      ? styles.statusBadge
      : status === "invited" || status === "draft"
        ? styles.statusBadgeWarning
        : status === "suspended"
          ? styles.statusBadgeDanger
          : styles.statusBadgeInactive;

  return <span className={className}>{status}</span>;
}
