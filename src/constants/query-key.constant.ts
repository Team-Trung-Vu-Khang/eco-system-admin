export const QUERY_KEY = {
  AUTH: {
    LOGIN: ["auth", "login"] as const,
    SESSION: ["auth", "session"] as const,
  },
  REFERRERS: {
    LIST: ["referrers", "list"] as const,
    CREATE: ["referrers", "create"] as const,
    UPDATE: ["referrers", "update"] as const,
    UPDATE_STATUS: ["referrers", "update-status"] as const,
    BULK_UPLOAD: ["referrers", "bulk-upload"] as const,
    BULK_UPLOAD_JOB: ["referrers", "bulk-upload-job"] as const,
  },
  USERS: {
    LIST: ["users", "list"] as const,
    DETAIL: ["users", "detail"] as const,
    CREATE: ["users", "create"] as const,
    UPDATE: ["users", "update"] as const,
    UPDATE_STATUS: ["users", "update-status"] as const,
    ASSIGN_ROLE: ["users", "assign-role"] as const,
    WORKSPACES: ["users", "workspaces"] as const,
    REVOKE_ROLE: ["users", "revoke-role"] as const,
    SET_REFERRER: ["users", "set-referrer"] as const,
    RESET_DEFAULT_PASSWORD: ["users", "reset-default-password"] as const,
  },
  PROVINCES: {
    LIST: ["provinces", "list"] as const,
  },
  WARDS: {
    LIST: ["wards", "list"] as const,
  },
} as const;
