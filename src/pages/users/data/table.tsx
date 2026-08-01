import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  getPlatformLabel,
  getRoleLabel,
  getStatusLabel,
  type AccountPlatform,
  type AccountRole,
  type AccountStatus,
  type PlatformGrant,
  summarizePlatformGrants,
  summarizeRoleGrants,
} from "./permissions";

export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthYear: string;
  address: string;
  referralName: string;
  role: AccountRole;
  platform: AccountPlatform;
  status: AccountStatus;
  lastLoginAt: string;
  description: string;
  platformGrants: PlatformGrant[];
};

export const userColumns: Column<UserRow>[] = [
  { key: "fullName", label: "Họ và tên", sortable: true },
  {
    key: "platform",
    label: "Nền tảng",
    render: (_value, row) => (
      <div className="space-y-1 text-sm text-slate-700">
        <div>{getPlatformLabel(row.platform)}</div>
        <div className="text-xs text-slate-500">
          {summarizePlatformGrants(row.platformGrants)}
        </div>
      </div>
    ),
  },
  { key: "email", label: "Email" },
  { key: "phone", label: "Số điện thoại" },
  { key: "birthYear", label: "Năm sinh" },
  {
    key: "role",
    label: "Vai trò",
    render: (_value, row) => (
      <div className="space-y-1 text-sm text-slate-700">
        <div>{getRoleLabel(row.role)}</div>
        <div className="text-xs text-slate-500">
          {summarizeRoleGrants(row.platformGrants)}
        </div>
      </div>
    ),
  },
  { key: "referralName", label: "Người giới thiệu" },
  { key: "lastLoginAt", label: "Đăng nhập gần nhất" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const status = getStatusLabel(value as AccountStatus);
      const variant = status === "Hoạt động" ? "secondary" : "destructive";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];
