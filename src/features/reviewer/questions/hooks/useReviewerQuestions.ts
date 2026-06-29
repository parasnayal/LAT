"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/components/toast/toast-provider";
import { reviewerQuestionsApi } from "../services/reviewerQuestionsApi";
import type {
  EditQuestionValues,
  ReviewPayload,
  ReviewerQuestionFilters,
  ReviewerQuestionListResponse
} from "../types/reviewer-question.types";

export function useReviewerQuestions(filters: ReviewerQuestionFilters) {
  return useQuery({
    queryKey: ["reviewer-questions", filters],
    queryFn: () => reviewerQuestionsApi.list(filters)
  });
}

export function useReviewerQuestion(id?: string) {
  return useQuery({
    queryKey: ["reviewer-question", id],
    queryFn: () => reviewerQuestionsApi.getById(id ?? ""),
    enabled: Boolean(id)
  });
}

export function useReviewQuestion() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReviewPayload }) =>
      reviewerQuestionsApi.review(id, payload),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["reviewer-questions"] });
      const previousLists = queryClient.getQueriesData<ReviewerQuestionListResponse>({
        queryKey: ["reviewer-questions"]
      });

      queryClient.setQueriesData<ReviewerQuestionListResponse>(
        { queryKey: ["reviewer-questions"] },
        (current) => {
          if (!current) {
            return current;
          }

          const nextItems = current.items.filter((question) => question.id !== id);

          return {
            ...current,
            items: nextItems,
            total: Math.max(0, current.total - (current.items.length - nextItems.length))
          };
        }
      );

      return { previousLists };
    },
    onError: (_error, _variables, context) => {
      context?.previousLists.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
      showToast({ title: "Unable to save review decision", variant: "error" });
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reviewer-questions"] }),
        queryClient.invalidateQueries({ queryKey: ["reviewer-question", variables.id] }),
        queryClient.invalidateQueries({ queryKey: ["question-bank"] })
      ]);
      showToast({ title: "Review decision saved", variant: "success" });
    }
  });
}

export function useUpdateReviewerQuestion() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EditQuestionValues }) =>
      reviewerQuestionsApi.update(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["reviewer-questions"] }),
        queryClient.invalidateQueries({ queryKey: ["reviewer-question", variables.id] })
      ]);
      showToast({ title: "Question updated", variant: "success" });
    },
    onError: () => showToast({ title: "Unable to update question", variant: "error" })
  });
}

export function useDuplicateReviewerQuestion() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: reviewerQuestionsApi.duplicate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviewer-questions"] });
      showToast({ title: "Question duplicated", variant: "success" });
    },
    onError: () => showToast({ title: "Unable to duplicate question", variant: "error" })
  });
}
