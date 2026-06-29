import Link from "next/link";
import type { Route } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { Bell } from "lucide-react";
import {
  AUTH_PERMISSIONS_COOKIE_NAME,
  AUTH_ROLES_COOKIE_NAME
} from "@/features/auth/constants/auth.constants";
import { SIDEBAR_NAVIGATION } from "@/shared/constants/navigation";
import { parseSerializedPermissions, hasAnyPermission } from "@/shared/lib/rbac";
import styles from "./app-shell.module.scss";

function parseSerializedRoles(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

export async function AppShell({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const permissions = parseSerializedPermissions(
    cookieStore.get(AUTH_PERMISSIONS_COOKIE_NAME)?.value
  );
  const roles = parseSerializedRoles(cookieStore.get(AUTH_ROLES_COOKIE_NAME)?.value);
  const navigation = SIDEBAR_NAVIGATION.filter(
    (item) =>
      hasAnyPermission(permissions, item.requiredPermissions ?? []) &&
      (!item.allowedRoles?.length || item.allowedRoles.some((role) => roles.includes(role)))
  );

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Platform navigation">
        <Link href="/dashboard" className={styles.brand}>
          <span className={styles.brandMark}>LAT</span>
          <span>
            <span className={styles.brandName}>PARAKH LAT</span>
            <span className={styles.brandSubtitle}>Competency Assessment Platform</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href as Route} className={styles.navLink}>
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        {/* <section className={styles.helpCard} aria-label="Need help">
          <p className={styles.helpTitle}>Need Help?</p>
          <p className={styles.helpText}>
            Connect with platform support for onboarding or assessment operations.
          </p>
          <Link href="/settings" className={styles.supportButton}>
            Support
          </Link>
        </section> */}
        <p className={styles.version}>v1.0.0</p>
      </aside>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <div>
              <p className={styles.breadcrumb}>Dashboard</p>
              <h1 className={styles.pageTitle}>Dashboard</h1>
            </div>
            <input
              className={styles.search}
              type="search"
              placeholder="Search assessments, questions, students..."
              aria-label="Global search"
            />
            <div className={styles.profileCluster}>
              <button className={styles.iconButton} type="button" aria-label="Notifications">
                <Bell size={18} aria-hidden="true" />
              </button>
              <span className={styles.roleBadge}>Admin</span>
              <span className={styles.avatar} aria-label="Current user Admin">
                A
              </span>
            </div>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
