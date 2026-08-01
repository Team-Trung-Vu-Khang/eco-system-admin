import { useState } from "react";
import { Plus, Upload, UserRound, Users } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImportUsersDialog } from "../../components/users/ImportUsersDialog";
import { userColumns, type UserRow } from "./data/table";
import { useUsers } from "./hooks/useUsers";

export default function UsersPage() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
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
    setLocation,
    isDeleting,
    filters,
    handleFilterChange,
  } = useUsers();

  return (
    <section className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Quản lý người dùng
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Danh sách người dùng của hệ thống. Bạn có thể tìm kiếm, lọc, xem,
              sửa, xóa và import dữ liệu ngay tại đây.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
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
        onView={(item) => {
          setSelectedUser(item);
          setInfoOpen(true);
        }}
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
        onImport={handleImportData}
      />

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
          {selectedUser ? (
            <div className="bg-gradient-to-br from-emerald-50 via-white to-sky-50">
              <div className="border-b border-slate-200/70 px-6 pb-5 pt-6">
                <DialogHeader className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                      <UserRound className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <DialogTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                        {selectedUser.fullName}
                      </DialogTitle>
                      <DialogDescription className="mt-1 text-sm leading-6 text-slate-500">
                        {selectedUser.description}
                      </DialogDescription>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        selectedUser.status === "Hoạt động"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {selectedUser.status}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      Đăng nhập gần nhất: {selectedUser.lastLoginAt}
                    </span>
                  </div>
                </DialogHeader>
              </div>

              <div className="px-6 py-5">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/85 shadow-sm">
                  <dl className="divide-y divide-slate-100">
                    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Email
                      </dt>
                      <dd className="text-sm font-medium text-slate-900">
                        {selectedUser.email}
                      </dd>
                    </div>
                    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Số điện thoại
                      </dt>
                      <dd className="text-sm font-medium text-slate-900">
                        {selectedUser.phone}
                      </dd>
                    </div>
                    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Người giới thiệu
                      </dt>
                      <dd className="text-sm font-medium text-slate-900">
                        {selectedUser.referralName || 'Không có'}
                      </dd>
                    </div>
                    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Vai trò
                      </dt>
                      <dd className="text-sm font-medium text-slate-900">
                        {selectedUser.role}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
