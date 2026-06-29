"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { studentApi } from "../services/studentApi";
import type { CreateStudentPayload } from "../types/student.types";

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentApi.list
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => studentApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      showToast({ title: "Student created", variant: "success" });
    },
    onError: () => {
      showToast({ title: "Unable to create student", variant: "error" });
    }
  });
}
