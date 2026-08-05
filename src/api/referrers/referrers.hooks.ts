import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key.constant";
import type {
  GetBulkUploadReferrerJobRequest,
  GetReferrersRequest,
  UpdateReferrerRequest,
} from "./referrers.request";
import {
  bulkUploadReferrers,
  createReferrer,
  getBulkUploadReferrerJob,
  getReferrers,
  updateReferrer,
  updateReferrerStatus,
} from "./referrers.api";

export function useReferrersQuery(query: GetReferrersRequest = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY.REFERRERS.LIST, query] as const,
    queryFn: async () => getReferrers(query),
  });
}

export function useCreateReferrerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.REFERRERS.CREATE,
    mutationFn: createReferrer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.REFERRERS.LIST,
      });
    },
  });
}

export function useUpdateReferrerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.REFERRERS.UPDATE,
    mutationFn: ({
      userId,
      ...body
    }: UpdateReferrerRequest & { userId: number | string }) =>
      updateReferrer(userId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.REFERRERS.LIST,
      });
    },
  });
}

export function useUpdateReferrerStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.REFERRERS.UPDATE_STATUS,
    mutationFn: updateReferrerStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.REFERRERS.LIST,
      });
    },
  });
}

export function useBulkUploadReferrersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.REFERRERS.BULK_UPLOAD,
    mutationFn: bulkUploadReferrers,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.REFERRERS.LIST,
      });
    },
  });
}

export function useBulkUploadReferrerJobQuery(
  query: GetBulkUploadReferrerJobRequest | null,
) {
  return useQuery({
    queryKey: query
      ? [...QUERY_KEY.REFERRERS.BULK_UPLOAD_JOB, query.jobExecutionId]
      : QUERY_KEY.REFERRERS.BULK_UPLOAD_JOB,
    queryFn: async () => {
      if (!query) {
        throw new Error("Missing bulk upload job execution id");
      }

      return getBulkUploadReferrerJob(query);
    },
    enabled: Boolean(query),
    refetchInterval: (state) =>
      state.state.data?.status === "STARTED" ? 3000 : false,
  });
}
