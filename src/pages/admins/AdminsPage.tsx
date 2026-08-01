import { useState } from 'react'
import { DeleteDialog } from '@Team-Trung-Vu-Khang/eco-shared-ui'
import { type AdminRow } from './data/admins'
import { useAdmins } from './hooks/useAdmins'
import { AdminDetailDialog } from './components/AdminDetailDialog'
import { AdminsListTable } from './components/AdminsListTable'
import { AdminsPageHeader } from './components/AdminsPageHeader'

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
      <AdminsPageHeader onCreateClick={() => setLocation('/admins/create')} />

      <AdminsListTable
        admins={admins}
        loading={loading}
        response={response}
        pageSize={pageSize}
        currentIndex={currentIndex}
        setPageSize={setPageSize}
        setCurrentIndex={setCurrentIndex}
        handleSearch={handleSearch}
        filters={filters}
        handleFilterChange={handleFilterChange}
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

      <AdminDetailDialog
        open={infoOpen}
        onOpenChange={setInfoOpen}
        admin={selectedAdmin}
      />
    </section>
  )
}
