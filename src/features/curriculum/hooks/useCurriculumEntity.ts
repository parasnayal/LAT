"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { curriculumApi, type CurriculumEntityMap } from "../services/curriculumApi";
import type {
  CurriculumEntityKind,
  CurriculumFormValues,
  CurriculumListParams
} from "../types/curriculum.types";
import { useToast } from "@/shared/components/toast/toast-provider";

export function useCurriculumEntity<TKey extends CurriculumEntityKind>(
  kind: TKey,
  params: CurriculumListParams = {}
) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const queryKey = ["curriculum", kind, params] as const;

  const listQuery = useQuery({
    queryKey,
    queryFn: () => curriculumApi.list<CurriculumEntityMap[TKey]>(kind, params)
  });

  const createMutation = useMutation({
    mutationFn: (payload: CurriculumFormValues) =>
      curriculumApi.create<CurriculumEntityMap[TKey]>(kind, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["curriculum", kind] });
      showToast({ title: "Created successfully", variant: "success" });
    },
    onError: () =>
      showToast({
        title: "Create failed",
        message: "Please check the form and try again.",
        variant: "error"
      })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CurriculumFormValues }) =>
      curriculumApi.update<CurriculumEntityMap[TKey]>(kind, id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["curriculum", kind] });
      showToast({ title: "Updated successfully", variant: "success" });
    },
    onError: () =>
      showToast({ title: "Update failed", message: "Please try again.", variant: "error" })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => curriculumApi.remove(kind, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["curriculum", kind] });
      showToast({ title: "Deleted successfully", variant: "success" });
    },
    onError: () =>
      showToast({ title: "Delete failed", message: "Please try again.", variant: "error" })
  });

  return {
    ...listQuery,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
}
