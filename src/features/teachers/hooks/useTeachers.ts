"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { teacherApi } from "../services/teacherApi";
import type { CreateTeacherPayload } from "../types/teacher.types";

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: teacherApi.list
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateTeacherPayload) => teacherApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      showToast({ title: "Teacher created", variant: "success" });
    },
    onError: () => {
      showToast({ title: "Unable to create teacher", variant: "error" });
    }
  });
}
