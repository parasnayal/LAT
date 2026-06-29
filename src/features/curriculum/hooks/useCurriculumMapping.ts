"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { curriculumApi } from "../services/curriculumApi";
import type { CurriculumMappingNode } from "../types/curriculum.types";
import { useToast } from "@/shared/components/toast/toast-provider";

export function useCurriculumMapping() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const query = useQuery({
    queryKey: ["curriculum", "mapping"],
    queryFn: curriculumApi.getMapping
  });

  const saveMutation = useMutation({
    mutationFn: (payload: CurriculumMappingNode[]) => curriculumApi.saveMapping(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["curriculum", "mapping"] });
      showToast({ title: "Mapping saved", variant: "success" });
    },
    onError: () => showToast({ title: "Unable to save mapping", variant: "error" })
  });

  return {
    ...query,
    saveMapping: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending
  };
}
