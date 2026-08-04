export const QUERY_KEY = {
  AUTH: {
    LOGIN: ["auth", "login"] as const,
    SESSION: ["auth", "session"] as const,
  },
  REFERRERS: {
    LIST: ["referrers", "list"] as const,
    CREATE: ["referrers", "create"] as const,
    UPDATE_STATUS: ["referrers", "update-status"] as const,
    BULK_UPLOAD: ["referrers", "bulk-upload"] as const,
    BULK_UPLOAD_JOB: ["referrers", "bulk-upload-job"] as const,
  },
} as const;
