import { useState } from 'react'
import { Plus, UserCog, UserRound } from 'lucide-react'
import {
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@Team-Trung-Vu-Khang/eco-shared-ui'
import { type AdminRow } from './data/admins'
import { adminColumns } from './data/table'
import { useAdmins } from './hooks/useAdmins'

export function AdminsPage() {
  const [infoOpen, setInfoOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRow | null>(null)
  const {
    admins,
    loading,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    filters,
    handleFilterChange,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    setLocation,
  } = useAdmins()

  return (
    <section className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <UserCog className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Quản trị viên
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Danh sách tài khoản quản trị. Bạn có thể tạo mới, chỉnh sửa theo
              từng trang riêng và gán phân quyền cho Admin Farm, Admin Edu, Admin
              Factory, Admin Shop, Admin System.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setLocation('/admins/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm quản trị viên
          </Button>
        </div>
      </div>

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
        onView={(item) => {
          setSelectedAdmin(item)
          setInfoOpen(true)
        }}
        onEdit={(item) => setLocation(`/admins/${item.id}/edit`)}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa quản trị viên"
        description="Bạn có chắc chắn muốn xóa quản trị viên này? Hoạt động này không thể hoàn tác."
      />

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="overflow-hidden border-0 bg-white p-0 shadow-none sm:max-w-2xl">
          {selectedAdmin ? (
            <div className="bg-white px-6 py-6">
              <DialogHeader className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <DialogTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                      {selectedAdmin.fullName}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm leading-6 text-slate-500">
                      {selectedAdmin.description}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      selectedAdmin.status === 'Hoạt động'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {selectedAdmin.status}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    Đăng nhập gần nhất: {selectedAdmin.lastLoginAt}
                  </span>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Email
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {selectedAdmin.email}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Số điện thoại
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {selectedAdmin.phone}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Vai trò
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {selectedAdmin.role}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Phân quyền
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdmin.permissions.map((permission: string) => (
                      <Badge key={permission} variant="outline">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
