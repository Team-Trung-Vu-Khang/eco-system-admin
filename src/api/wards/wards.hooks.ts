import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key.constant";
import type { GetWardsRequest } from "./wards.request";
import { getWards } from "./wards.api";

export function useWardsQuery(query: GetWardsRequest) {
  return useQuery({
    queryKey: [...QUERY_KEY.WARDS.LIST, query] as const,
    queryFn: async () => getWards(query),
    enabled: Boolean(query.provinceCode),
  });
}
