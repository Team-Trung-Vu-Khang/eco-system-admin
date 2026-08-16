// === List & CRUD responses ===

export type ReferrerLookup = {
  id: number;
  fullName: string;
  phoneNumber: string;
  province: string;
  commune: string;
};

export type AccountLookup = {
  userId: number;
  fullName: string;
};

/** Response chung cho GET list, POST create, PUT update */
export type ReferredResponse = {
  id: number;
  phoneNumber: string;
  referrer: ReferrerLookup;
  account: AccountLookup | null;
  createdAt: string;
  updatedAt: string;
};

export type ReferredListResponse = {
  content: ReferredResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type CreateReferredResponse = ReferredResponse;
export type UpdateReferredResponse = ReferredResponse;

// === Bulk upload responses ===

export type BulkUploadReferredResponse = {
  jobExecutionId: number;
  status: string;
};

export type BulkUploadReferredJobProgress = {
  totalRows: number;
  processedRows: number;
};

export type BulkUploadReferredOutcome = "CREATED" | "OVERWRITTEN";

export type BulkUploadReferredFailureReason =
  | "INVALID_REFERRER_PHONE_FORMAT"
  | "INVALID_REFERRED_PHONE_FORMAT"
  | "REFERRER_NOT_FOUND";

export type BulkUploadReferredJobRow = {
  id: number;
  rowNumber: number;
  referredPhoneNumber: string;
  referredFullName: string | null;
  success: boolean;
  outcome: BulkUploadReferredOutcome | null;
  failureReason: BulkUploadReferredFailureReason | null;
  referrerPhoneNumber: string;
  referrerFullName: string | null;
  previousReferrerPhoneNumber: string | null;
  previousReferrerFullName: string | null;
};

/** rows là PHÂN TRANG — content + page metadata */
export type BulkUploadReferredJobResult = {
  totalRows: number;
  created: number;
  overwritten: number;
  unchanged: number;
  failed: number;
  rows: {
    content: BulkUploadReferredJobRow[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
};

export type BulkUploadReferredJobResponse = {
  jobExecutionId: number;
  status: string;
  progress: BulkUploadReferredJobProgress | null;
  result: BulkUploadReferredJobResult | null;
};
