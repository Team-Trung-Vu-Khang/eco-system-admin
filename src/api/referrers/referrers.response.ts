export type ReferrerListItem = {
  id: number;
  code: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  operatingArea: string;
  province?: string;
  commune?: string;
  birthYear: number;
  roleCodes: string[];
  status: string;
  mustChangePassword: boolean;
  createdAt: string;
};

export type ReferrerListResponse = {
  content: ReferrerListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type CreateReferrerResponse = ReferrerListItem;
export type UpdateReferrerResponse = ReferrerListItem;

export type UpdateReferrerStatusResponse = {
  userId: number;
  isReferrer: boolean;
};

export type BulkUploadReferrersResponse = {
  jobExecutionId: number;
  status: string;
};

export type BulkUploadReferrerJobProgress = {
  totalRows: number;
  processedRows: number;
};

export type BulkUploadReferrerJobError = {
  rowNumber: number;
  phoneNumber: string;
  message: string;
};

export type BulkUploadReferrerJobResult = {
  totalRows: number;
  created: number;
  promoted: number;
  skippedDuplicates: number;
  failed: number;
  errors: BulkUploadReferrerJobError[];
};

export type BulkUploadReferrerJobResponse = {
  jobExecutionId: number;
  status: string;
  progress: BulkUploadReferrerJobProgress;
  result: BulkUploadReferrerJobResult | null;
};
