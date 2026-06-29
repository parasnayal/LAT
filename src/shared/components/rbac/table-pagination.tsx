"use client";

import styles from "./rbac-components.module.scss";

type TablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function TablePagination({ page, pageSize, total, onPageChange }: TablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className={styles.pagination}>
      <span>
        Page {page} of {pageCount} - {total} records
      </span>
      <div className={styles.paginationActions}>
        <button
          className={styles.secondaryButton}
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <button
          className={styles.secondaryButton}
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
