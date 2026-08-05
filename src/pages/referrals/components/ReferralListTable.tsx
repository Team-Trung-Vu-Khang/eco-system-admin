import { useMemo } from "react";
import {
  Badge,
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MoreHorizontal, PencilLine, Power } from "lucide-react";
import type { ReferralRow } from "../data/referrals";

type ReferralListTableProps = {
  data: ReferralRow[];
  pageSize: number;
  currentIndex: number;
  totalElements: number;
  totalPages: number;
  loading: boolean;
  onSearch: (value: string) => void;
  onPageSize: (value: number) => void;
  onIndexChange: (value: number) => void;
  onEdit?: (row: ReferralRow) => void;
  onToggleStatus?: (row: ReferralRow) => void;
};

export function ReferralListTable({
  data,
  pageSize,
  currentIndex,
  totalElements,
  totalPages,
  loading,
  onSearch,
  onPageSize,
  onIndexChange,
  onEdit,
  onToggleStatus,
}: ReferralListTableProps) {
  const renderStatusBadge = (status: ReferralRow["status"]) => {
    const variant = status === "Hoạt động" ? "secondary" : "destructive";

    return <Badge variant={variant}>{status}</Badge>;
  };

  const columns: Column<ReferralRow>[] = useMemo(
    () => [
      { key: "fullName", label: "Người giới thiệu", sortable: true },
      { key: "phone", label: "Số điện thoại" },
      { key: "province", label: "Tỉnh" },
      { key: "commune", label: "Phường/Xã" },
      {
        key: "status",
        label: "Trạng thái",
        render: (_value, row) => renderStatusBadge(row.status),
        width: "120px",
      },
      { key: "updatedAt", label: "Cập nhật gần nhất" },
      {
        key: "actions",
        label: "Thao tác",
        render: (_value, row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Mở thao tác</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit?.(row)}>
                <PencilLine className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              {onToggleStatus ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onToggleStatus(row)}>
                    <Power className="mr-2 h-4 w-4" />
                    {row.status === "Hoạt động"
                      ? "Không hoạt động"
                      : "Kích hoạt"}
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        width: "96px",
      },
    ],
    [onEdit, onToggleStatus],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      searchPlaceholder="Tìm kiếm theo số điện thoại, tên, tỉnh..."
      selectable={false}
      loading={loading}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalElements={totalElements}
      totalPages={totalPages}
      onSearch={onSearch}
      onPageSize={onPageSize}
      onIndexChange={onIndexChange}
    />
  );
}
