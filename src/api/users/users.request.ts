import type { ApiQueryParams } from "@/api/apiClient";

export type UserBusinessGroup = "EDU" | "FARM" | "FACTORY" | "SHOP";

export type AdminUserAudienceType =
  | "individual"
  | "cooperative"
  | "business"
  | "other";

export type GetUsersRequest = {
  businessGroup?: UserBusinessGroup;
  status?: string;
  keyword?: string;
  page?: number;
  size?: number;
};

export function buildUsersParams(
  query: GetUsersRequest = {},
): ApiQueryParams {
  return {
    businessGroup: query.businessGroup,
    status: query.status?.trim() || undefined,
    keyword: query.keyword?.trim() || undefined,
    page: query.page,
    size: query.size,
  };
}

export type AdminCreateUserRequest = {
  email: string;
  fullName: string;
  phoneNumber: string;
  operatingArea: string;
  birthYear: number;
  referrerPhoneNumber?: string;
  roles: string[];
  audienceType: AdminUserAudienceType;
};

export type ResetDefaultPasswordRequest = {
  userId: number | string;
};

export type SetUserReferrerRequest = {
  userId: number | string;
  referrerPhoneNumber: string;
};

export type AssignUserRoleRequest = {
  userId: number | string;
  roleCode: string;
  workspaceId?: number | string;
};

export type RevokeUserRoleRequest = {
  userId: number | string;
  roleId: number | string;
  workspaceId?: number | string;
};
