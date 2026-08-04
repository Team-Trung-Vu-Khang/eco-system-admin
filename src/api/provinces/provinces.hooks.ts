import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key.constant";
import type { GetProvincesRequest } from "./provinces.request";
import { getProvinces } from "./provinces.api";

export function useProvincesQuery(query: GetProvincesRequest = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY.PROVINCES.LIST, query] as const,
    queryFn: async () => getProvinces(query),
  });
}
