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
  PROVINCES: {
    LIST: "/api/admin/master-data/geo/provinces",
  },
  APP: {
    HOME: "/users",
  },
} as const;
