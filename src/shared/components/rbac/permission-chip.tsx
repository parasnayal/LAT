import styles from "./rbac-components.module.scss";

type PermissionChipProps = {
  code: string;
};

export function PermissionChip({ code }: PermissionChipProps) {
  return <span className={styles.permissionChip}>{code}</span>;
}
