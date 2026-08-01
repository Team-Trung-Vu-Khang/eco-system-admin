import { UserCog } from 'lucide-react'
import { DataTable } from '@Team-Trung-Vu-Khang/eco-shared-ui'
import { adminColumns } from './data/table'
import { useAdmins } from './hooks/useAdmins'

export function AdminsPage() {
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
  } = useAdmins()

  return (
    <section className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
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
            Danh sách các tài khoản có quyền quản trị hệ thống. Có thể tìm kiếm
            và lọc nhanh theo vai trò hoặc trạng thái.
          </p>
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
      />
    </section>
  )
}
