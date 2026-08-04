import { Plus, Upload, Users } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImportUsersDialog } from "./components/ImportUsersDialog";
import { userColumns } from "./data/table";
import { useUsers } from "./hooks/useUsers";

export default function UsersPage() {
  const {
    users,
    loading,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    deleteOpen,
    setDeleteOpen,
    importOpen,
    setImportOpen,
    handleDelete,
    handleConfirmDelete,
    handleImportData,
    upsertManyUsers,
    setLocation,
    isDeleting,
    filters,
    handleFilterChange,
  } = useUsers();

  return (
    <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Quản lý tài khoản
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Danh sách tài khoản theo nền tảng, vai trò và trạng thái. Bạn có
              thể tìm kiếm, lọc, sửa, xóa và nhập dữ liệu ngay tại đây.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Nhập dữ liệu
          </Button>
          <Button onClick={() => setLocation("/users/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </div>

      <DataTable
        columns={userColumns}
        data={users}
        searchable
        onEdit={(item) => setLocation(`/users/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm người dùng..."
        filters={filters}
        onFilterChange={handleFilterChange}
        selectable={false}
        loading={loading}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onSearch={handleSearch}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa người dùng này? Hoạt động này không thể hoàn tác."
        loading={isDeleting}
      />

      <ImportUsersDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        existingEmails={users.map((user) => user.email)}
        onImport={(rows) => {
          upsertManyUsers(rows);
          handleImportData();
        }}
      />
    </section>
  );
}
