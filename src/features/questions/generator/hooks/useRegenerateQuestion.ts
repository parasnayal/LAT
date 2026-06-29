"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { questionGeneratorApi } from "../services/questionGeneratorApi";

export function useRegenerateQuestion() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: questionGeneratorApi.regenerate,
    onError: () => showToast({ title: "Unable to regenerate question", variant: "error" })
  });
}
