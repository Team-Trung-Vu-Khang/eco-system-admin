import { apiClient, type ApiQueryParams } from "@/api/apiClient";
import { PATH } from "@/constants/path.constant";
import type { GetProvincesRequest } from "./provinces.request";
import type { ProvinceListResponse } from "./provinces.response";

function buildProvinceListParams(
  query: GetProvincesRequest = {},
): ApiQueryParams {
  return {
    keyword: query.keyword,
    status: query.status,
    page: query.page,
    size: query.size,
  };
}

export async function getProvinces(query: GetProvincesRequest = {}) {
  return apiClient.get<ProvinceListResponse>(PATH.PROVINCES.LIST, {
    params: buildProvinceListParams(query),
  });
}
