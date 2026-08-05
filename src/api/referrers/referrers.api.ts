import { apiClient, type ApiQueryParams } from "@/api/apiClient";
import { PATH } from "@/constants/path.constant";
import type { BulkUploadReferrersRequest } from "./referrers.request";
import type { CreateReferrerRequest } from "./referrers.request";
import type { GetBulkUploadReferrerJobRequest } from "./referrers.request";
import type { GetReferrersRequest } from "./referrers.request";
import type { UpdateReferrerRequest } from "./referrers.request";
import type { UpdateReferrerStatusRequest } from "./referrers.request";
import type { BulkUploadReferrersResponse } from "./referrers.response";
import type { CreateReferrerResponse } from "./referrers.response";
import type { BulkUploadReferrerJobResponse } from "./referrers.response";
import type { ReferrerListResponse } from "./referrers.response";
import type { UpdateReferrerResponse } from "./referrers.response";
import type { UpdateReferrerStatusResponse } from "./referrers.response";

function buildReferrerListParams(
  query: GetReferrersRequest = {},
): ApiQueryParams {
  const keyword = query.keyword?.trim() ?? "";

  return {
    keyword,
    page: query.page,
    size: query.size,
  };
}

export async function getReferrers(query: GetReferrersRequest = {}) {
  return apiClient.get<ReferrerListResponse>(PATH.REFERRERS.LIST, {
    params: buildReferrerListParams(query),
  });
}

export async function createReferrer(
  body: CreateReferrerRequest,
): Promise<CreateReferrerResponse> {
  return apiClient.post<CreateReferrerResponse>(PATH.REFERRERS.CREATE, body);
}

export async function updateReferrer(
  userId: number | string,
  body: UpdateReferrerRequest,
): Promise<UpdateReferrerResponse> {
  return apiClient.put<UpdateReferrerResponse>(PATH.REFERRERS.UPDATE(userId), body);
}

export async function updateReferrerStatus(
  body: UpdateReferrerStatusRequest,
): Promise<UpdateReferrerStatusResponse> {
  const { userId, ...payload } = body;
  return apiClient.request<UpdateReferrerStatusResponse>(
    PATH.REFERRERS.UPDATE_STATUS(userId),
    {
      method: "PUT",
      body: payload,
    },
  );
}

export async function bulkUploadReferrers(
  body: BulkUploadReferrersRequest,
): Promise<BulkUploadReferrersResponse> {
  const formData = new FormData();
  formData.append("file", body.file);

  return apiClient.post<BulkUploadReferrersResponse>(
    PATH.REFERRERS.BULK_UPLOAD,
    formData,
  );
}

export async function getBulkUploadReferrerJob({
  jobExecutionId,
}: GetBulkUploadReferrerJobRequest): Promise<BulkUploadReferrerJobResponse> {
  return apiClient.get<BulkUploadReferrerJobResponse>(
    PATH.REFERRERS.BULK_UPLOAD_JOB(jobExecutionId),
  );
}
