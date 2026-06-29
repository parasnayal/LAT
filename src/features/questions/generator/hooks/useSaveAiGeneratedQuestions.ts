"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { questionGeneratorApi } from "../services/questionGeneratorApi";

export function useSaveAiGeneratedQuestions() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: questionGeneratorApi.saveAiGeneratedQuestions,
    onSuccess: () => showToast({ title: "Assessment questions saved", variant: "success" }),
    onError: () => showToast({ title: "Unable to save assessment questions", variant: "error" })
  });
}
