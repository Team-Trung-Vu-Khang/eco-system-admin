import { PATH } from "@/constants/path.constant";
import { apiClient, type ApiQueryParams } from "../apiClient";
import type {
  BulkUploadReferredRequest,
  CreateReferredRequest,
  GetBulkUploadReferredJobRequest,
  GetReferredListRequest,
  UpdateReferredRequest,
} from "./update-user-referrer.request";
import type {
  BulkUploadReferredJobResponse,
  BulkUploadReferredResponse,
  CreateReferredResponse,
  ReferredListResponse,
  UpdateReferredResponse,
} from "./update-user-referrer.response";

function buildReferredListParams(
  query: GetReferredListRequest = {},
): ApiQueryParams {
  return {
    keyword: query.keyword?.trim() || undefined,
    referrerPhoneNumber: query.referrerPhoneNumber?.trim() || undefined,
    page: query.page,
    size: query.size,
  };
}

export async function getReferredList(query: GetReferredListRequest = {}) {
  return apiClient.get<ReferredListResponse>(PATH.UPDATE_USER_REFERRAL.LIST, {
    params: buildReferredListParams(query),
  });
}

export async function createReferred(
  body: CreateReferredRequest,
): Promise<CreateReferredResponse> {
  return apiClient.post<CreateReferredResponse>(
    PATH.UPDATE_USER_REFERRAL.CREATE,
    body,
  );
}

export async function updateReferred(
  referredId: number | string,
  body: UpdateReferredRequest,
): Promise<UpdateReferredResponse> {
  return apiClient.put<UpdateReferredResponse>(
    PATH.UPDATE_USER_REFERRAL.UPDATE(referredId),
    body,
  );
}

export async function bulkUploadReferred(
  body: BulkUploadReferredRequest,
): Promise<BulkUploadReferredResponse> {
  const formData = new FormData();
  formData.append("file", body.file);

  return apiClient.post<BulkUploadReferredResponse>(
    PATH.UPDATE_USER_REFERRAL.BULK_UPLOAD,
    formData,
  );
}

export async function getBulkUploadReferredJob({
  jobExecutionId,
  page,
  size,
}: GetBulkUploadReferredJobRequest): Promise<BulkUploadReferredJobResponse> {
  return apiClient.get<BulkUploadReferredJobResponse>(
    PATH.UPDATE_USER_REFERRAL.BULK_UPLOAD_JOB(jobExecutionId),
    {
      params: {
        page,
        size,
      },
    },
  );
}
