"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authService } from "../services/auth.service";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { useAuthStore } from "../store/auth.store";
import { getDefaultRouteForRole } from "../utils/role-routing";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ApiError } from "@/shared/services/http/api-error";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);

    try {
      const response = await authService.login(values);
      setSession(response.user, response.accessToken);
      const redirectTo = getDefaultRouteForRole(response.roleCode);
      router.push(redirectTo as Route);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : "Unable to sign in");
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>
      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
