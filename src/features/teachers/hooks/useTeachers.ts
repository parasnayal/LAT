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
    onSuccess: async (teacher) => {
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      showToast({
        title: "Teacher created",
        message: `${teacher.teacherName || teacher.userName || "Teacher"} was added successfully.`,
        variant: "success"
      });
    },
    onError: (error) => {
      showToast({
        title: "Unable to create teacher",
        message: error instanceof Error ? error.message : "Please check the details and try again.",
        variant: "error"
      });
    }
  });
}
