import * as XLSX from "xlsx";
import type {
  BulkUploadReferredJobRow,
  ReferredResponse,
} from "@/api/update-user-referrer/update-user-referrer.response";

// === Row type for the list table ===

export type ReferredRow = {
  id: string;
  phoneNumber: string;
  referrerPhone: string;
  referrerName: string;
  referrerProvince: string;
  referrerCommune: string;
  accountUserId: number | null;
  accountFullName: string | null;
  hasAccount: boolean;
  createdAt: string;
  updatedAt: string;
};

// === Client-side upload review (pre-submit validation) ===

export type UpdateUserReferralUploadReviewRow = {
  id: string;
  lineNumber: number;
  studentPhone: string;
  referrerPhone: string;
  action: "Thêm mới" | "Cập nhật" | "Lỗi";
  valid: boolean;
  reasons: string[];
};

export type UpdateUserReferralUploadReview = {
  rows: UpdateUserReferralUploadReviewRow[];
  successCount: number;
  failCount: number;
  errorMessage?: string;
};

// === Constants ===

export const vietnamMobilePhoneRegex = /^(?:\+?84|0)(3|5|7|8|9)\d{8}$/;

export const updateUserReferralTemplateFileName =
  "mau_danh_sach_nguoi_gioi_thieu_kem_hoc_vien.xlsx";

// === Enum → Vietnamese text mapping (bulk upload results) ===

export const OUTCOME_LABELS: Record<string, string> = {
  CREATED: "Thêm mới",
  OVERWRITTEN: "Ghi đè",
};

export const FAILURE_REASON_LABELS: Record<string, string> = {
  INVALID_REFERRER_PHONE_FORMAT: "SĐT người giới thiệu sai định dạng",
  INVALID_REFERRED_PHONE_FORMAT: "SĐT học viên sai định dạng",
  REFERRER_NOT_FOUND: "Không tìm thấy người giới thiệu (hoặc không active)",
};

export function formatBulkUploadRowDescription(
  row: BulkUploadReferredJobRow,
): string {
  if (!row.success) {
    return (
      FAILURE_REASON_LABELS[row.failureReason ?? ""] ?? "Lỗi không xác định"
    );
  }

  if (row.outcome === "OVERWRITTEN") {
    const prev = row.previousReferrerFullName
      ? `${row.previousReferrerFullName} (${row.previousReferrerPhoneNumber})`
      : (row.previousReferrerPhoneNumber ?? "?");

    const next = row.referrerFullName
      ? `${row.referrerFullName} (${row.referrerPhoneNumber})`
      : row.referrerPhoneNumber;

    if (!prev) {
      return `Thêm mới: ${next}`;
    }

    return `Đổi từ ${prev} sang ${next}`;
  }

  return OUTCOME_LABELS[row.outcome ?? ""] ?? "Thành công";
}

// === Phone normalization ===

export function normalizePhoneTo84(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";

  let normalized = digits;
  if (normalized.startsWith("00")) {
    normalized = normalized.replace(/^0+/, "");
  }

  if (normalized.startsWith("84")) {
    return normalized;
  }

  if (normalized.startsWith("0")) {
    return `84${normalized.slice(1)}`;
  }

  return `84${normalized}`;
}

// === Date formatting ===

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

// === Upload file parsing (client-side) ===

function isUploadHeader(columns: string[]) {
  const header = columns.join(" ").toLowerCase();
  return (
    header.includes("số điện thoại người giới thiệu") ||
    header.includes("số điện thoại học viên") ||
    header.includes("so dien thoai nguoi gioi thieu") ||
    header.includes("so dien thoai hoc vien")
  );
}

const MAX_UPLOAD_ROWS = 500;

export function reviewUpdateReferralUploadText(
  text: string,
): UpdateUserReferralUploadReview {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return {
      rows: [],
      successCount: 0,
      failCount: 0,
    };
  }

  // Detect and skip header row
  const firstRowColumns = rows[0].split(/[,\t;|]/).map((cell) => cell.trim());
  const hasHeader = isUploadHeader(firstRowColumns);
  const dataRowCount = hasHeader ? rows.length - 1 : rows.length;

  if (dataRowCount > MAX_UPLOAD_ROWS) {
    return {
      rows: [],
      successCount: 0,
      failCount: dataRowCount,
      errorMessage: `File có ${dataRowCount} dòng dữ liệu, vượt quá giới hạn ${MAX_UPLOAD_ROWS} dòng. Vui lòng chia nhỏ file và thử lại.`,
    };
  }

  const reviewedRows: UpdateUserReferralUploadReviewRow[] = [];
  let successCount = 0;

  for (const [index, row] of rows.entries()) {
    const columns = row.split(/[,\t;|]/).map((cell) => cell.trim());

    if (columns.every((cell) => cell.length === 0)) {
      continue;
    }

    if (index === 0 && isUploadHeader(columns)) {
      continue;
    }

    const reasons: string[] = [];
    const rawReferrerPhone = columns[0] ?? "";
    const rawStudentPhone = columns[1] ?? "";
    const referrerPhone = normalizePhoneTo84(rawReferrerPhone);
    const studentPhone = normalizePhoneTo84(rawStudentPhone);

    if (columns.length < 2) {
      reasons.push(
        "Thiếu đủ 2 cột: số điện thoại người giới thiệu, số điện thoại học viên",
      );
    }

    if (!rawReferrerPhone.trim()) {
      reasons.push("Thiếu số điện thoại người giới thiệu");
    } else if (!referrerPhone || referrerPhone.length < 10) {
      reasons.push("Số điện thoại người giới thiệu không hợp lệ");
    }

    if (!rawStudentPhone.trim()) {
      reasons.push("Thiếu số điện thoại học viên");
    } else if (!studentPhone || studentPhone.length < 10) {
      reasons.push("Số điện thoại học viên không hợp lệ");
    }

    const valid = reasons.length === 0;
    if (valid) {
      successCount++;
    }

    reviewedRows.push({
      valid,
      reasons,
      studentPhone,
      referrerPhone,
      lineNumber: index + 1,
      action: valid ? "Cập nhật" : "Lỗi",
      id: `${index + 1}-${referrerPhone || "invalid"}-${studentPhone || "invalid"}`,
    });
  }

  return {
    rows: reviewedRows,
    successCount,
    failCount: reviewedRows.length - successCount,
  };
}

export async function parseUpdateReferralUploadFile(file: File) {
  const isExcelFile = /\.(xlsx|xls)$/i.test(file.name);

  if (!isExcelFile) {
    return file.text();
  }

  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return "";
  }

  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_csv(worksheet);
}

// === Template workbook ===

export function buildReferralTemplateWorkbook() {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Số điện thoại người giới thiệu", "Số điện thoại học viên"],
    ["09012345678", "09012345678"],
  ]);

  worksheet["!cols"] = [{ wch: 22 }, { wch: 22 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trang tính1");

  return workbook;
}

// === Response → Row mapping ===

export function mapReferredToRow(item: ReferredResponse): ReferredRow {
  return {
    id: String(item.id),
    phoneNumber: item.phoneNumber ?? "",
    referrerPhone: item.referrer?.phoneNumber ?? "",
    referrerName: item.referrer?.fullName ?? "",
    referrerProvince: item.referrer?.province ?? "",
    referrerCommune: item.referrer?.commune ?? "",
    accountUserId: item.account?.userId ?? null,
    accountFullName: item.account?.fullName ?? null,
    hasAccount: item.account != null,
    createdAt: formatDateTime(item.createdAt),
    updatedAt: formatDateTime(item.updatedAt),
  };
}
