"use client";

import { useState } from "react";
import { RoleTable } from "./role-table";
import { useRoles } from "../hooks/use-roles";
import { EntityFormModal } from "@/shared/components/rbac/entity-form-modal";
import rbacStyles from "@/shared/components/rbac/rbac-components.module.scss";
import pageStyles from "@/shared/components/rbac/rbac-page.module.scss";
import { TablePagination } from "@/shared/components/rbac/table-pagination";

const pageSize = 6;

export function RolesManagementPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const rolesQuery = useRoles({ search, status, page, pageSize });
  const data = rolesQuery.data;

  return (
    <section className={pageStyles.page}>
      <header className={pageStyles.header}>
        <div>
          <h1>Role management</h1>
          <p>
            Define enterprise roles for PARAKH LAT operations and assign granular permissions
            independently from role records.
          </p>
        </div>
        <button
          className={rbacStyles.primaryButton}
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          Create role
        </button>
      </header>
      <div className={pageStyles.summaryGrid}>
        <article className={pageStyles.summaryCard}>
          <span>Total roles</span>
          <strong>{data?.total ?? 0}</strong>
        </article>
        <article className={pageStyles.summaryCard}>
          <span>Active roles</span>
          <strong>{data?.items.filter((role) => role.status === "active").length ?? 0}</strong>
        </article>
        <article className={pageStyles.summaryCard}>
          <span>Page size</span>
          <strong>{pageSize}</strong>
        </article>
      </div>
      <div className={rbacStyles.toolbar}>
        <input
          className={rbacStyles.searchInput}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search roles"
          aria-label="Search roles"
        />
        <select
          className={rbacStyles.select}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter role status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      {rolesQuery.isLoading ? (
        <div className={rbacStyles.skeleton} />
      ) : (
        <RoleTable roles={data?.items ?? []} />
      )}
      {data ? (
        <TablePagination
          page={data.page}
          pageSize={data.pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      ) : null}
      <EntityFormModal
        title="Create role"
        description="Create a new role, then assign permissions through the permission mapping workflow."
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  );
}
