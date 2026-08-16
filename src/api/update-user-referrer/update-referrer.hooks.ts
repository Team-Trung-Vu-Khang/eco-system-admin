import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GetBulkUploadReferredJobRequest,
  GetReferredListRequest,
  UpdateReferredRequest,
} from "./update-user-referrer.request";
import { QUERY_KEY } from "@/constants/query-key.constant";
import {
  bulkUploadReferred,
  createReferred,
  getBulkUploadReferredJob,
  getReferredList,
  updateReferred,
} from "./update-user-referrer.api";

export function useReferredListQuery(query: GetReferredListRequest = {}) {
  console.log("query", query);

  return useQuery({
    queryKey: [...QUERY_KEY.UPDATE_USER_REFERRAL.LIST, query] as const,
    queryFn: async () => getReferredList(query),
  });
}

export function useCreateReferredMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.UPDATE_USER_REFERRAL.CREATE,
    mutationFn: createReferred,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.UPDATE_USER_REFERRAL.LIST,
      });
    },
  });
}

export function useUpdateReferredMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.UPDATE_USER_REFERRAL.UPDATE,
    mutationFn: ({
      referredId,
      ...body
    }: UpdateReferredRequest & { referredId: number | string }) =>
      updateReferred(referredId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.UPDATE_USER_REFERRAL.LIST,
      });
    },
  });
}

export function useBulkUploadReferredMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.UPDATE_USER_REFERRAL.BULK_UPLOAD,
    mutationFn: bulkUploadReferred,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.UPDATE_USER_REFERRAL.LIST,
      });
    },
  });
}

export function useBulkUploadReferredJobQuery(
  query: GetBulkUploadReferredJobRequest | null,
) {
  return useQuery({
    queryKey: query
      ? [
          ...QUERY_KEY.UPDATE_USER_REFERRAL.BULK_UPLOAD_JOB,
          query.jobExecutionId,
          query.page,
          query.size,
        ]
      : QUERY_KEY.UPDATE_USER_REFERRAL.BULK_UPLOAD_JOB,
    queryFn: async () => {
      if (!query) {
        throw new Error("Missing bulk upload job execution id");
      }

      return getBulkUploadReferredJob(query);
    },
    enabled: Boolean(query),
    refetchInterval: (state) =>
      state.state.data?.status === "STARTED" ? 3000 : false,
  });
}
