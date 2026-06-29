"use client";

import { useState } from "react";
import { PermissionTable } from "./permission-table";
import { usePermissions } from "../hooks/use-permissions";
import { EntityFormModal } from "@/shared/components/rbac/entity-form-modal";
import rbacStyles from "@/shared/components/rbac/rbac-components.module.scss";
import pageStyles from "@/shared/components/rbac/rbac-page.module.scss";
import { TablePagination } from "@/shared/components/rbac/table-pagination";
import { permissionResourceOptions } from "@/shared/lib/mock-rbac-data";

const pageSize = 8;

export function PermissionsManagementPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [resource, setResource] = useState("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const permissionsQuery = usePermissions({ search, status, resource, page, pageSize });
  const data = permissionsQuery.data;

  return (
    <section className={pageStyles.page}>
      <header className={pageStyles.header}>
        <div>
          <h1>Permissions</h1>
          <p>
            Manage atomic authorization capabilities such as question.approve, assessment.publish,
            analytics.view, and settings.manage.
          </p>
        </div>
        <button
          className={rbacStyles.primaryButton}
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          Create permission
        </button>
      </header>
      <div className={pageStyles.summaryGrid}>
        <article className={pageStyles.summaryCard}>
          <span>Total permissions</span>
          <strong>{data?.total ?? 0}</strong>
        </article>
        <article className={pageStyles.summaryCard}>
          <span>Selected resource</span>
          <strong>{resource === "all" ? "All" : resource}</strong>
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
          placeholder="Search permissions"
          aria-label="Search permissions"
        />
        <select
          className={rbacStyles.select}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter permission status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className={rbacStyles.select}
          value={resource}
          onChange={(event) => setResource(event.target.value)}
          aria-label="Filter permission resource"
        >
          <option value="all">All resources</option>
          {permissionResourceOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {permissionsQuery.isLoading ? (
        <div className={rbacStyles.skeleton} />
      ) : (
        <PermissionTable permissions={data?.items ?? []} />
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
        title="Create permission"
        description="Create a new permission code that can be assigned to roles without changing user records."
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  );
}
