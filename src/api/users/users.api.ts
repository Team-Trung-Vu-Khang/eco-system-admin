import { apiClient } from "@/api/apiClient";
import { PATH } from "@/constants/path.constant";
import type { AssignUserRoleRequest } from "./users.request";
import type { AdminCreateUserRequest } from "./users.request";
import type { ResetDefaultPasswordRequest } from "./users.request";
import type { RevokeUserRoleRequest } from "./users.request";
import type { SetUserReferrerRequest } from "./users.request";
import type { AssignUserRoleResponse } from "./users.response";
import type { AdminCreateUserResponse } from "./users.response";
import type { ResetDefaultPasswordResponse } from "./users.response";
import type { RevokeUserRoleResponse } from "./users.response";
import type { SetUserReferrerResponse } from "./users.response";
import type { UserWorkspacesResponse } from "./users.response";
import type { UserListResponse } from "./users.response";
import type { GetUsersRequest } from "./users.request";
import { buildUsersParams } from "./users.request";

export async function getUsers(query: GetUsersRequest = {}) {
  return apiClient.get<UserListResponse>(PATH.USERS.LIST, {
    params: buildUsersParams(query),
  });
}

export async function createUser(body: AdminCreateUserRequest) {
  return apiClient.post<AdminCreateUserResponse>(PATH.USERS.CREATE, body);
}

export async function assignUserRole(
  { userId, workspaceId, roleCode }: AssignUserRoleRequest,
): Promise<AssignUserRoleResponse> {
  return apiClient.post<AssignUserRoleResponse>(PATH.USERS.ASSIGN_ROLE(userId), {
    roleCode,
    ...(workspaceId !== undefined ? { workspaceId } : {}),
  });
}

export async function getUserWorkspaces(
  userId: number | string,
): Promise<UserWorkspacesResponse> {
  return apiClient.get<UserWorkspacesResponse>(PATH.USERS.WORKSPACES(userId));
}

export async function revokeUserRole(
  { userId, roleId, workspaceId }: RevokeUserRoleRequest,
): Promise<RevokeUserRoleResponse> {
  return apiClient.request<RevokeUserRoleResponse>(PATH.USERS.REVOKE_ROLE(userId, roleId), {
    method: "DELETE",
    params: workspaceId !== undefined ? { workspaceId } : undefined,
  });
}

export async function resetDefaultPassword(
  { userId }: ResetDefaultPasswordRequest,
): Promise<ResetDefaultPasswordResponse> {
  return apiClient.post<ResetDefaultPasswordResponse>(
    PATH.USERS.RESET_DEFAULT_PASSWORD(userId),
  );
}

export async function setUserReferrer(
  { userId, referrerPhoneNumber }: SetUserReferrerRequest,
): Promise<SetUserReferrerResponse> {
  return apiClient.put<SetUserReferrerResponse>(PATH.USERS.SET_REFERRER(userId), {
    referrerPhoneNumber,
  });
}
