"use client";

import { useState } from "react";
import { UserTable } from "./user-table";
import { useUsers } from "../hooks/use-users";
import { EntityFormModal } from "@/shared/components/rbac/entity-form-modal";
import rbacStyles from "@/shared/components/rbac/rbac-components.module.scss";
import pageStyles from "@/shared/components/rbac/rbac-page.module.scss";
import { TablePagination } from "@/shared/components/rbac/table-pagination";
import { roleFilterOptions } from "@/shared/lib/mock-rbac-data";

const pageSize = 6;

export function UsersManagementPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const usersQuery = useUsers({ search, status, role, page, pageSize });
  const data = usersQuery.data;

  return (
    <section className={pageStyles.page}>
      <header className={pageStyles.header}>
        <div>
          <h1>Users</h1>
          <p>
            Provision users, assign roles, manage status, and preserve audit history across
            organizations, schools, reviewers, teachers, and students.
          </p>
        </div>
        <button
          className={rbacStyles.primaryButton}
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          Create user
        </button>
      </header>
      <div className={pageStyles.summaryGrid}>
        <article className={pageStyles.summaryCard}>
          <span>Total users</span>
          <strong>{data?.total ?? 0}</strong>
        </article>
        <article className={pageStyles.summaryCard}>
          <span>Active on page</span>
          <strong>{data?.items.filter((user) => user.status === "active").length ?? 0}</strong>
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
          placeholder="Search users"
          aria-label="Search users"
        />
        <select
          className={rbacStyles.select}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter user status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="invited">Invited</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          className={rbacStyles.select}
          value={role}
          onChange={(event) => setRole(event.target.value)}
          aria-label="Filter user role"
        >
          <option value="all">All roles</option>
          {roleFilterOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {usersQuery.isLoading ? (
        <div className={rbacStyles.skeleton} />
      ) : (
        <UserTable users={data?.items ?? []} />
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
        title="Create user"
        description="Invite a user, bind them to an organization or school, and assign one or more roles."
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </section>
  );
}
