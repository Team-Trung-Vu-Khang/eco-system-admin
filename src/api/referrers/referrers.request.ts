export type GetReferrersRequest = {
  keyword?: string;
  page?: number;
  size?: number;
};

export type CreateReferrerRequest = {
  phoneNumber: string;
  fullName: string;
  province: string;
};

export type UpdateReferrerStatusRequest = {
  userId: number;
  isReferrer: boolean;
};

export type BulkUploadReferrersRequest = {
  file: File;
};

export type GetBulkUploadReferrerJobRequest = {
  jobExecutionId: number;
};
