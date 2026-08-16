import { useMemo } from "react";
import { DataTable, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReferredRow } from "../data/update-user-referral";

type UpdateUserReferralTableProps = {
  data: ReferredRow[];
  pageSize: number;
  currentIndex: number;
  totalElements: number;
  totalPages: number;
  loading: boolean;
  onSearch: (value: string) => void;
  onPageSize: (value: number) => void;
  onIndexChange: (value: number) => void;
};

export function ReferredListTable({
  data,
  pageSize,
  currentIndex,
  totalElements,
  totalPages,
  loading,
  onSearch,
  onPageSize,
  onIndexChange,
}: UpdateUserReferralTableProps) {
  const columns: Column<ReferredRow>[] = useMemo(
    () => [
      {
        key: "phoneNumber",
        label: "SĐT người được giới thiệu",
        sortable: true,
      },
      {
        key: "accountFullName",
        label: "Tên người được giới thiệu",
        render: (_value, row) => (
          <span className="text-sm text-slate-700">
            {row.accountFullName ?? "—"}
          </span>
        ),
      },
      // { key: "referrerPhone", label: "SĐT người giới thiệu" },
      // { key: "referrerName", label: "Tên người giới thiệu" },
      { key: "referrerProvince", label: "Tỉnh" },
      { key: "referrerCommune", label: "Phường/Xã" },
      // {
      //   key: "hasAccount",
      //   label: (
      //     <div>
      //       <div>Trạng thái tài khoản</div>
      //       của người được giới thiệu
      //     </div>
      //   ) as unknown as string,
      //   width: "160px",
      //   render: (_value, row) => (
      //     <Badge variant={row.hasAccount ? "secondary" : "outline"}>
      //       {row.hasAccount ? "Đã có tài khoản" : "Chưa có tài khoản"}
      //     </Badge>
      //   ),
      // },
      { key: "updatedAt", label: "Cập nhật gần nhất" },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      searchPlaceholder="Tìm kiếm theo số điện thoại học viên..."
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
