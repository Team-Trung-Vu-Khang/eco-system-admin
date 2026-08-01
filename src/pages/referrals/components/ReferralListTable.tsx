import { useMemo } from "react";
import { Badge, DataTable, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReferralRow } from "../data/referrals";

type ReferralListTableProps = {
  data: ReferralRow[];
  pageSize: number;
  currentIndex: number;
  totalElements: number;
  totalPages: number;
  provinceOptions: { label: string; value: string }[];
  onSearch: (value: string) => void;
  onPageSize: (value: number) => void;
  onIndexChange: (value: number) => void;
  onFilterChange: (key: string, value: string) => void;
  onView: (row: ReferralRow) => void;
  onEdit: (row: ReferralRow) => void;
  onDelete: (row: ReferralRow) => void;
}

export function ReferralListTable({
  data,
  pageSize,
  currentIndex,
  totalElements,
  totalPages,
  provinceOptions,
  onSearch,
  onPageSize,
  onIndexChange,
  onFilterChange,
  onView,
  onEdit,
  onDelete,
}: ReferralListTableProps) {
  const columns: Column<ReferralRow>[] = useMemo(
    () => [
      { key: "phone", label: "Số điện thoại" },
      { key: "fullName", label: "Người giới thiệu", sortable: true },
      { key: "province", label: "Tỉnh" },
      {
        key: "status",
        label: "Trạng thái",
        render: (value) => {
          const status = String(value);
          const variant = status === "Hoạt động" ? "secondary" : "destructive";

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      { key: "updatedAt", label: "Cập nhật gần nhất" },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      searchPlaceholder="Tìm kiếm theo số điện thoại, tên, tỉnh..."
      selectable={false}
      loading={false}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalElements={totalElements}
      totalPages={totalPages}
      onSearch={onSearch}
      onPageSize={onPageSize}
      onIndexChange={onIndexChange}
      filters={[
        {
          key: "province",
          label: "Tỉnh",
          options: provinceOptions,
        },
      ]}
      onFilterChange={onFilterChange}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}
