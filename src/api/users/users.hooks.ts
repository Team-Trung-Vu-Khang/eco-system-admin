import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/query-key.constant";
import {
  assignUserRole,
  createUser,
  getUsers,
  getUserWorkspaces,
  resetDefaultPassword,
  revokeUserRole,
  setUserReferrer,
} from "./users.api";
import type {
  AssignUserRoleRequest,
  AdminCreateUserRequest,
  GetUsersRequest,
  ResetDefaultPasswordRequest,
  RevokeUserRoleRequest,
  SetUserReferrerRequest,
} from "./users.request";

export function useUsersQuery(query: GetUsersRequest = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY.USERS.LIST, query] as const,
    queryFn: async () => getUsers(query),
  });
}

export function useAssignUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.USERS.ASSIGN_ROLE,
    mutationFn: (body: AssignUserRoleRequest) => assignUserRole(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USERS.LIST,
      });
    },
  });
}

export function useUserWorkspacesQuery(userId: number | string | null) {
  return useQuery({
    queryKey: userId ? [...QUERY_KEY.USERS.WORKSPACES, userId] as const : QUERY_KEY.USERS.WORKSPACES,
    queryFn: async () => {
      if (userId === null) {
        throw new Error("Missing user id");
      }

      return getUserWorkspaces(userId);
    },
    enabled: userId !== null,
  });
}

export function useRevokeUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.USERS.REVOKE_ROLE,
    mutationFn: (body: RevokeUserRoleRequest) => revokeUserRole(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USERS.LIST,
      });
    },
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEY.USERS.CREATE,
    mutationFn: (body: AdminCreateUserRequest) => createUser(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USERS.LIST,
      });
    },
  });
}

export function useResetDefaultPasswordMutation() {
  return useMutation({
    mutationKey: QUERY_KEY.USERS.RESET_DEFAULT_PASSWORD,
    mutationFn: (body: ResetDefaultPasswordRequest) => resetDefaultPassword(body),
  });
}

export function useSetUserReferrerMutation() {
  return useMutation({
    mutationKey: QUERY_KEY.USERS.SET_REFERRER,
    mutationFn: (body: SetUserReferrerRequest) => setUserReferrer(body),
  });
}
