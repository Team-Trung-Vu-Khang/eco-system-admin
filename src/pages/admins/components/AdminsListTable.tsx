import { DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { adminColumns } from "../data/table";
import type { AdminRow } from "../data/admins";
import type { useAdmins } from "../hooks/useAdmins";

type AdminsListTableProps = {
  admins: AdminRow[];
  loading: boolean;
  response: ReturnType<typeof useAdmins>["response"];
  pageSize: number;
  currentIndex: number;
  setPageSize: (value: number) => void;
  setCurrentIndex: (value: number) => void;
  handleSearch: (value: string) => void;
  filters: ReturnType<typeof useAdmins>["filters"];
  handleFilterChange: (key: string, value: string) => void;
  onView: (item: AdminRow) => void;
  onEdit: (item: AdminRow) => void;
  onDelete: (item: AdminRow) => void;
};

export function AdminsListTable({
  admins,
  loading,
  response,
  pageSize,
  currentIndex,
  setPageSize,
  setCurrentIndex,
  handleSearch,
  filters,
  handleFilterChange,
  onView,
  onEdit,
  onDelete,
}: AdminsListTableProps) {
  return (
    <DataTable
      columns={adminColumns}
      data={admins}
      searchable
      searchPlaceholder="Tìm kiếm quản trị viên..."
      selectable={false}
      loading={loading}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalElements={response.totalElements}
      totalPages={response.totalPages}
      onSearch={handleSearch}
      onPageSize={setPageSize}
      onIndexChange={setCurrentIndex}
      filters={filters}
      onFilterChange={handleFilterChange}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
