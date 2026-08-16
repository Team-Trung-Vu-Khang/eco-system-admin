export type GetReferredListRequest = {
  page?: number;
  size?: number;
  keyword?: string;
  referrerPhoneNumber?: string;
};

export type CreateReferredRequest = {
  referredPhoneNumber: string;
  referrerPhoneNumber: string;
};

export type UpdateReferredRequest = {
  referredPhoneNumber?: string;
  referrerPhoneNumber: string;
};

export type BulkUploadReferredRequest = {
  file: File;
};

export type GetBulkUploadReferredJobRequest = {
  jobExecutionId: number;
  page?: number;
  size?: number;
};
