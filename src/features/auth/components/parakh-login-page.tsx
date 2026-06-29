"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpenCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck
} from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { getDefaultRouteForRole } from "../utils/role-routing";
import { ROLE_PERMISSION_MAP } from "@/shared/constants/rbac";
import type { RoleCode } from "@/shared/types/rbac";
import styles from "./parakh-login-page.module.scss";

type LoginRole = "Admin" | "Teacher / Reviewer" | "Assessment Manager";

const roleHints: LoginRole[] = ["Admin", "Teacher / Reviewer", "Assessment Manager"];

const platformHighlights = [
  {
    icon: BookOpenCheck,
    text: "Generate competency-based questions"
  },
  {
    icon: ShieldCheck,
    text: "Review and approve AI-generated questions"
  },
  {
    icon: GraduationCap,
    text: "Build Grade 3, 6, and 9 assessments"
  },
  {
    icon: BarChart3,
    text: "Track learning outcomes and performance analytics"
  }
] as const;

const parakhLoginSchema = z.object({
  identifier: z.string().min(1, "Email / User ID is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean()
});

type ParakhLoginFormValues = z.infer<typeof parakhLoginSchema>;

export function ParakhLoginPage() {
  const router = useRouter();
  const passwordHintId = useId();
  const formStatusId = useId();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<LoginRole>("Admin");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ParakhLoginFormValues>({
    resolver: zodResolver(parakhLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: true
    }
  });

  async function onSubmit(values: ParakhLoginFormValues) {
    setStatusMessage(null);
    setSubmitError(null);

    try {
      const loginResponse = await authService.login({
        userName: values.identifier,
        password: values.password,
        rememberMe: values.rememberMe
      });
      const roleCode = (loginResponse.roleCode ?? "super_admin") as RoleCode;

      setSession(loginResponse.user, loginResponse.accessToken);

      const sessionResponse = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          rememberMe: values.rememberMe,
          roleCode,
          roleId: loginResponse.user.roleId,
          token: loginResponse.accessToken
        })
      });

      if (!sessionResponse.ok) {
        setSubmitError("Login succeeded, but session setup failed. Please try again.");
        return;
      }

      window.localStorage.setItem("accessToken", loginResponse.accessToken);
      window.localStorage.setItem("permissions", ROLE_PERMISSION_MAP[roleCode].join(","));
      setStatusMessage("Sign in successful. Opening workspace...");
      const redirectTo = getDefaultRouteForRole(roleCode);
      router.push(redirectTo as Route);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to sign in");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.leftPanel} aria-labelledby="platform-title">
        <div className={styles.brandMark} aria-hidden="true">
          LAT
        </div>
        <p className={styles.eyebrow}>PARAKH-aligned assessment operations</p>
        <h1 id="platform-title" className={styles.title}>
          PARAKH LAT Platform
        </h1>
        <p className={styles.subtitle}>Competency-Based Learning Assessment System</p>
        <p className={styles.description}>
          A secure workspace for Learning Assessment Test teams to map competencies, generate
          quality questions, manage reviews, and monitor assessment readiness.
        </p>

        <ul className={styles.highlightList} aria-label="Platform capabilities">
          {platformHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <li className={styles.highlightItem} key={item.text}>
                <span className={styles.highlightIcon} aria-hidden="true">
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span>{item.text}</span>
              </li>
            );
          })}
        </ul>

        <div className={styles.gradeBand} aria-label="Supported grades">
          <span>Grade 3</span>
          <span>Grade 6</span>
          <span>Grade 9</span>
        </div>
      </section>

      <section className={styles.rightPanel} aria-labelledby="login-title">
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <p className={styles.cardEyebrow}>Secure sign in</p>
            <h2 id="login-title">Welcome back</h2>
            <p>
              Access question generation, review workflow, question bank, assessments, and
              analytics.
            </p>
          </div>

          <div className={styles.roleHint} aria-label="Role based login hint">
            {roleHints.map((role) => (
              <button
                className={role === selectedRole ? styles.roleButtonActive : styles.roleButton}
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                aria-pressed={role === selectedRole}
              >
                {role}
              </button>
            ))}
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="identifier">Email / User ID</label>
              <div className={styles.inputShell}>
                <Mail size={18} aria-hidden="true" />
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  aria-invalid={Boolean(errors.identifier)}
                  aria-describedby={errors.identifier ? "identifier-error" : undefined}
                  placeholder="name@school.gov.in"
                  {...register("identifier")}
                />
              </div>
              {errors.identifier ? (
                <p className={styles.errorText} id="identifier-error" role="alert">
                  {errors.identifier.message}
                </p>
              ) : null}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputShell}>
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : passwordHintId}
                  placeholder="Enter password"
                  {...register("password")}
                />
                <button
                  className={styles.passwordToggle}
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
              <p className={styles.assistiveText} id={passwordHintId}>
                Use your assigned PARAKH LAT credentials.
              </p>
              {errors.password ? (
                <p className={styles.errorText} id="password-error" role="alert">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <div className={styles.formMeta}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register("rememberMe")} />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password">Forgot password?</a>
            </div>

            {statusMessage ? (
              <p className={styles.successText} id={formStatusId} role="status">
                {statusMessage}
              </p>
            ) : null}
            {submitError ? (
              <p className={styles.errorText} role="alert">
                {submitError}
              </p>
            ) : null}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isSubmitting}
              aria-describedby={formStatusId}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className={styles.spinner} size={18} aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                "Log in to LAT"
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
