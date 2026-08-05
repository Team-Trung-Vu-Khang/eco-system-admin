import dayjs from "dayjs";
import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { UserItem } from "@/api/users/users.response";

export type UserListRow = {
  id: string;
  code: string;
  fullName: string;
  username: string;
  email: string;
  operatingArea: string;
  province: string;
  commune: string;
  birthYear: string;
  roleCodes: string[];
  status: string;
  mustChangePassword: boolean;
  createdAt: string;
};

const roleLabelMap: Record<string, string> = {
  MEVI_SUPER_ADMIN: "Quản trị tổng",
  MEVI_REFERRER: "Người giới thiệu",
  MEVI_ADMIN: "Quản trị hệ thống",
  MEVI_EDU_ADMIN: "Quản trị giáo dục",
  MEVI_EDU_TRAINEES: "Học viên",
  MEVI_EDU_LECTURER: "Giảng viên",
  MEVI_FARM_ADMIN: "Quản trị trang trại",
  MEVI_FARM_MEMBER: "Thành viên trang trại",
  MEVI_FACTORY_ADMIN: "Quản trị nhà máy",
  MEVI_FACTORY_MEMBER: "Thành viên nhà máy",
  MEVI_SHOP_ADMIN: "Quản trị cửa hàng",
  MEVI_SHOP_MEMBER: "Thành viên cửa hàng",
};

function toText(value: string | number | boolean | null | undefined) {
  return value == null ? "" : String(value);
}

function formatDateTime(value: string) {
  const date = dayjs(value);

  if (!date.isValid()) {
    return value;
  }

  return date.format("DD/MM/YYYY HH:mm");
}

function getRoleLabel(roleCode: string) {
  return roleLabelMap[roleCode] ?? roleCode;
}

export function mapUserItemToRow(item: UserItem): UserListRow {
  return {
    id: toText(item.id),
    code: toText(item.code),
    fullName: toText(item.fullName),
    username: toText(item.username),
    email: toText(item.email),
    operatingArea: toText(item.operatingArea),
    province: toText(item.province),
    commune: toText(item.commune),
    birthYear: toText(item.birthYear),
    roleCodes: Array.isArray(item.roleCodes)
      ? item.roleCodes.filter(Boolean)
      : [],
    status: toText(item.status),
    mustChangePassword: Boolean(item.mustChangePassword),
    createdAt: formatDateTime(toText(item.createdAt)),
  };
}

function renderRoleBadges(roleCodes: string[]) {
  const labels = roleCodes.map(getRoleLabel).filter(Boolean);
  const visibleLabels = labels.slice(0, 2);
  const hiddenLabels = labels.slice(2);

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-1.5">
        {visibleLabels.length > 0 ? (
          visibleLabels.map((label) => (
            <Badge
              key={label}
              variant="secondary"
              className="max-w-full truncate"
            >
              {label}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-slate-500">Chưa có</span>
        )}

        {hiddenLabels.length > 0 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="cursor-default">
                +{hiddenLabels.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-xs">
              <div className="space-y-1">
                {labels.map((label) => (
                  <div key={label} className="text-xs">
                    {label}
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </TooltipProvider>
  );
}

export const userColumns: Column<UserListRow>[] = [
  { key: "code", label: "Mã", sortable: true },
  { key: "fullName", label: "Họ và tên", sortable: true },
  { key: "username", label: "Tên đăng nhập" },
  { key: "email", label: "Email" },
  { key: "operatingArea", label: "Khu vực HĐ" },
  { key: "province", label: "Tỉnh/TP" },
  { key: "commune", label: "Xã/Phường" },
  { key: "birthYear", label: "Năm sinh" },
  {
    key: "roleCodes",
    label: "Vai trò",
    render: (_value, row) => renderRoleBadges(row.roleCodes),
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
