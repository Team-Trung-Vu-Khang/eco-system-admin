export type GetReferrersRequest = {
  keyword?: string;
  status?: "active" | "inactive";
  page?: number;
  size?: number;
};

export type CreateReferrerRequest = {
  phoneNumber: string;
  fullName: string;
  province: string;
  commune: string;
};

export type UpdateReferrerRequest = {
  phoneNumber: string;
  fullName: string;
  province: string;
  commune: string;
};

export type UpdateReferrerStatusRequest = {
  referrerId: number;
  active: boolean;
};

export type BulkUploadReferrersRequest = {
  file: File;
};

export type GetBulkUploadReferrerJobRequest = {
  jobExecutionId: number;
};
