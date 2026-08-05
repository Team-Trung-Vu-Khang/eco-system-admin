import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { UserItem } from "@/api/users/users.response";

export type UserListRow = {
  id: string;
  code: string;
  fullName: string;
  username: string;
  email: string;
  operatingArea: string;
  birthYear: string;
  roleCodes: string;
  status: string;
  mustChangePassword: boolean;
  createdAt: string;
};

function toText(value: string | number | boolean | null | undefined) {
  return value == null ? "" : String(value);
}

export function mapUserItemToRow(item: UserItem): UserListRow {
  return {
    id: toText(item.id),
    code: toText(item.code),
    fullName: toText(item.fullName),
    username: toText(item.username),
    email: toText(item.email),
    operatingArea: toText(item.operatingArea),
    birthYear: toText(item.birthYear),
    roleCodes: Array.isArray(item.roleCodes)
      ? item.roleCodes.filter(Boolean).join(", ")
      : "",
    status: toText(item.status),
    mustChangePassword: Boolean(item.mustChangePassword),
    createdAt: toText(item.createdAt),
  };
}

export const userColumns: Column<UserListRow>[] = [
  { key: "code", label: "Mã", sortable: true },
  { key: "fullName", label: "Họ và tên", sortable: true },
  { key: "username", label: "Tên đăng nhập" },
  { key: "email", label: "Email" },
  { key: "operatingArea", label: "Khu vực" },
  { key: "birthYear", label: "Năm sinh" },
  {
    key: "roleCodes",
    label: "Vai trò",
    render: (_value, row) => (
      <div
        className="max-w-[18rem] truncate text-sm text-slate-700"
        title={row.roleCodes}
      >
        {row.roleCodes || "Chưa có"}
      </div>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_value, row) => {
      const variant = row.status === "active" ? "secondary" : "destructive";
      const label = row.status === "active" ? "Hoạt động" : "Khóa";

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    key: "mustChangePassword",
    label: "Đổi mật khẩu",
    render: (_value, row) => (
      <Badge variant={row.mustChangePassword ? "destructive" : "secondary"}>
        {row.mustChangePassword ? "Bắt buộc" : "Không"}
      </Badge>
    ),
  },
  { key: "createdAt", label: "Ngày tạo" },
];
