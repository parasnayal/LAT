"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { questionGeneratorApi } from "../services/questionGeneratorApi";

export function useGenerateQuestions() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: questionGeneratorApi.generate,
    onError: () =>
      showToast({
        title: "Unable to generate questions",
        message: "Please check the selected curriculum and try again.",
        variant: "error"
      })
  });
}
