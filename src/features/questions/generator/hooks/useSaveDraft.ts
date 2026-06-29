"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { questionGeneratorApi } from "../services/questionGeneratorApi";

export function useSaveDraft() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: questionGeneratorApi.saveDraft,
    onSuccess: () => showToast({ title: "Draft saved", variant: "success" }),
    onError: () => showToast({ title: "Unable to save draft", variant: "error" })
  });
}
