import { apiClient, type ApiQueryParams } from "@/api/apiClient";
import { PATH } from "@/constants/path.constant";
import type { GetWardsRequest } from "./wards.request";
import type { WardListResponse } from "./wards.response";

function buildWardListParams(
  query: GetWardsRequest,
): ApiQueryParams {
  return {
    provinceCode: query.provinceCode,
    keyword: query.keyword?.trim() || undefined,
    status: query.status?.trim() || undefined,
    page: query.page,
    size: query.size,
  };
}

export async function getWards(query: GetWardsRequest) {
  return apiClient.get<WardListResponse>(PATH.WARDS.LIST, {
    params: buildWardListParams(query),
  });
}
