export const PATH = {
  AUTH: {
    LOGIN: "/auth/login",
    CALLBACK: "/auth/callback",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  REFERRERS: {
    LIST: "/api/admin/referrers",
    CREATE: "/api/admin/referrers",
    UPDATE_STATUS: (userId: number | string) =>
      `/api/admin/referrers/${userId}/status`,
    BULK_UPLOAD: "/api/admin/referrers/bulk-upload",
    BULK_UPLOAD_JOB: (jobExecutionId: number | string) =>
      `/api/admin/referrers/bulk-upload/${jobExecutionId}`,
  },
  USERS: {
    LIST: "/api/admin/users",
    CREATE: "/api/admin/users",
    ASSIGN_ROLE: (userId: number | string) => `/api/admin/users/${userId}/roles`,
    WORKSPACES: (userId: number | string) => `/api/admin/users/${userId}/workspaces`,
    REVOKE_ROLE: (userId: number | string, roleId: number | string) =>
      `/api/admin/users/${userId}/roles/${roleId}`,
    SET_REFERRER: (userId: number | string) =>
      `/api/admin/users/${userId}/referrer`,
    RESET_DEFAULT_PASSWORD: (userId: number | string) =>
      `/api/admin/users/${userId}/password/reset-default`,
  },
  PROVINCES: {
    LIST: "/api/admin/master-data/geo/provinces",
  },
  APP: {
    HOME: "/users",
  },
} as const;
