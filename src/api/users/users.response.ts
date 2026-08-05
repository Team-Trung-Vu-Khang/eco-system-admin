export type UserItem = {
  id: number;
  code: string;
  username: string;
  email: string;
  fullName: string;
  operatingArea: string;
  birthYear: number;
  roleCodes: string[];
  status: string;
  mustChangePassword: boolean;
  createdAt: string;
};

export type UserDetailResponse = UserItem & {
  phoneNumber?: string;
  province: string;
  commune: string;
};

export type UserListResponse = {
  content: UserItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type AdminCreateUserResponse = UserItem;
export type UpdateUserResponse = UserDetailResponse;
export type UpdateUserStatusResponse = {
  userId: number;
  status: "active" | "inactive";
};

export type ResetDefaultPasswordResponse = {
  messageKey: string;
  message: string;
  mustChangePassword: boolean;
};

export type SetUserReferrerResponse = {
  userId: number;
  referrer: {
    userId: number;
    fullName: string;
    phoneNumber: string;
  };
};

export type AssignUserRoleResponse = {
  id: number;
  roleId: number;
  roleCode: string;
  roleName: string;
  workspaceId: number | null;
  createdAt: string;
};

export type RevokeUserRoleResponse = void;

export type UserWorkspacesResponse = number[];
