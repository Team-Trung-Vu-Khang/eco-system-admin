import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  normalizeRoleValue,
  normalizeStatusValue,
} from "./permissions";
import type { UserRow } from "./table";

export type UserImportValues = Pick<
  UserRow,
  "fullName" | "email" | "phone" | "referralName" | "role" | "status"
>;

export type UserImportReviewRow = {
  id: string;
  lineNumber: number;
  fullName: string;
  email: string;
  phone: string;
  referralName: string;
  role: string;
  status: string;
  action: "Thêm mới" | "Cập nhật" | "Lỗi";
  valid: boolean;
  reasons: string[];
};

export type UserImportReview = {
  rows: UserImportReviewRow[];
  validValues: UserImportValues[];
  successCount: number;
  failCount: number;
};

export const userImportColumns: Column<UserImportReviewRow>[] = [
  { key: "lineNumber", label: "Dòng", width: "80px" },
  { key: "fullName", label: "Họ và tên", width: "170px" },
  { key: "email", label: "Email", width: "220px" },
  { key: "phone", label: "Số điện thoại", width: "140px" },
  { key: "referralName", label: "Người giới thiệu", width: "160px" },
  { key: "role", label: "Vai trò", width: "140px" },
  { key: "status", label: "Trạng thái", width: "130px" },
  {
    key: "action",
    label: "Kết quả",
    width: "120px",
    render: (value, row) => (
      <Badge variant={String(value) === "Lỗi" ? "destructive" : "secondary"}>
        {row.action}
      </Badge>
    ),
  },
  {
    key: "reasons",
    label: "Lý do",
    width: "320px",
    render: (value, row) => {
      const reasons = Array.isArray(value) ? value : row.reasons;

      return (
        <div className="whitespace-normal break-words text-sm leading-6 text-slate-600">
          {reasons.length > 0
            ? reasons.join(", ")
            : row.action === "Cập nhật"
              ? "Sẽ cập nhật bản ghi có email này"
              : "Hợp lệ"}
        </div>
      );
    },
  },
];

function normalizePhoneTo84(input: string) {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";

  let normalized = digits;
  if (normalized.startsWith("00")) {
    normalized = normalized.replace(/^0+/, "");
  }

  if (normalized.startsWith("84")) return normalized;
  if (normalized.startsWith("0")) return `84${normalized.slice(1)}`;

  return `84${normalized}`;
}

function isUploadHeader(columns: string[]) {
  const header = columns.join(" ").toLowerCase();
  return (
    header.includes("email") ||
    header.includes("phone") ||
    header.includes("sdt") ||
    header.includes("số điện thoại") ||
    header.includes("full name") ||
    header.includes("họ và tên") ||
    header.includes("tên") ||
    header.includes("role") ||
    header.includes("vai trò") ||
    header.includes("status") ||
    header.includes("trạng thái")
  );
}

export function reviewUserUploadText(
  text: string,
  existingEmails: string[] = [],
): UserImportReview {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows: [], validValues: [], successCount: 0, failCount: 0 };
  }

  const rows: UserImportReviewRow[] = [];
  const validValues: UserImportValues[] = [];
  const existingEmailSet = new Set(existingEmails.map((email) => email.toLowerCase()));
  const seenEmailsInFile = new Set<string>();

  for (const [index, line] of lines.entries()) {
    const columns = line
      .split(/[,\t;|]/)
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (index === 0 && isUploadHeader(columns)) continue;

    const reasons: string[] = [];
    const fullName = columns[0] ?? "";
    const email = columns[1] ?? "";
    const phoneRaw = columns[2] ?? "";
    const referralName = columns[3] ?? "";
    const role = columns[4] ?? "";
    const status = columns[5] ?? "";
    const phone = normalizePhoneTo84(phoneRaw);
    const emailKey = email.toLowerCase();
    const isExisting = emailKey ? existingEmailSet.has(emailKey) : false;

    if (columns.length < 6) {
      reasons.push("Thiếu đủ 6 cột: họ và tên, email, số điện thoại, người giới thiệu, vai trò, trạng thái");
    }
    if (!fullName.trim()) reasons.push("Thiếu họ và tên");
    if (!email.trim()) {
      reasons.push("Thiếu email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      reasons.push("Email không hợp lệ");
    }
    if (!phoneRaw.trim()) {
      reasons.push("Thiếu số điện thoại");
    } else if (!phone || phone.length < 10) {
      reasons.push("Số điện thoại không hợp lệ");
    }
    if (!referralName.trim()) reasons.push("Thiếu người giới thiệu");
    if (!role.trim()) reasons.push("Thiếu vai trò");
    if (!status.trim()) reasons.push("Thiếu trạng thái");
    if (emailKey && seenEmailsInFile.has(emailKey)) {
      reasons.push("Email bị trùng trong tệp");
    }

    const valid = reasons.length === 0;
    if (valid) {
      seenEmailsInFile.add(emailKey);
      validValues.push({
        fullName: fullName.trim(),
        email: email.trim(),
        phone,
        referralName: referralName.trim(),
        role: normalizeRoleValue(role.trim()),
        status: normalizeStatusValue(status.trim()),
      });
    }

    rows.push({
      id: `${index + 1}-${emailKey || "invalid"}`,
      lineNumber: index + 1,
      fullName: fullName.trim(),
      email: email.trim(),
      phone,
      referralName: referralName.trim(),
      role: role.trim(),
      status: status.trim(),
      action: valid ? (isExisting ? "Cập nhật" : "Thêm mới") : "Lỗi",
      valid,
      reasons,
    });
  }

  return {
    rows,
    validValues,
    successCount: validValues.length,
    failCount: rows.length - validValues.length,
  };
}

export function buildUserImportTemplate() {
  return [
    "Họ và tên,Email,Số điện thoại,Người giới thiệu,Vai trò,Trạng thái",
    "Nguyễn Văn A,a@example.com,0901234567,Trần Thị B,Quản trị viên,Hoạt động",
    "Trần Thị B,b@example.com,0902345678,Nguyễn Văn A,Người dùng,Hoạt động",
  ].join("\n");
}
