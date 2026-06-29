"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { questionGeneratorApi } from "../services/questionGeneratorApi";

export function useSubmitReview() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (questionIds: string[]) =>
      Promise.all(questionIds.map((id) => questionGeneratorApi.submitReview(id))),
    onSuccess: () => showToast({ title: "Submitted for review", variant: "success" }),
    onError: () => showToast({ title: "Unable to submit for review", variant: "error" })
  });
}
