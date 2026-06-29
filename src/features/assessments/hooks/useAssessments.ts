"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { assessmentApi } from "../services/assessmentApi";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: assessmentApi.list
  });
}

export function useStartAssessment() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (assessmentId: string) => assessmentApi.publish(assessmentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assessments"] });
      showToast({ title: "Assessment started", variant: "success" });
    },
    onError: () => {
      showToast({ title: "Unable to start assessment", variant: "error" });
    }
  });
}
