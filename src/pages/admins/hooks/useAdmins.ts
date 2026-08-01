import { useMemo, useState } from 'react'
import type { AdminRow } from '../data/table'

const seedAdmins: AdminRow[] = [
  {
    id: 'a-1',
    fullName: 'Nguyễn Văn Huy',
    email: 'huy.nguyen@ecosystem.vn',
    role: 'Super Admin',
    status: 'Hoạt động',
    lastLoginAt: '31/07/2026 09:12',
    scope: 'Toàn hệ thống',
  },
  {
    id: 'a-2',
    fullName: 'Trần Minh Thảo',
    email: 'thao.tran@ecosystem.vn',
    role: 'System Admin',
    status: 'Hoạt động',
    lastLoginAt: '31/07/2026 15:38',
    scope: 'Người dùng, phân quyền',
  },
  {
    id: 'a-3',
    fullName: 'Lê Quốc Bảo',
    email: 'bao.le@ecosystem.vn',
    role: 'Operations Admin',
    status: 'Tạm khóa',
    lastLoginAt: '29/07/2026 18:20',
    scope: 'Vận hành, báo cáo',
  },
  {
    id: 'a-4',
    fullName: 'Phạm Thị Linh',
    email: 'linh.pham@ecosystem.vn',
    role: 'Audit Admin',
    status: 'Hoạt động',
    lastLoginAt: '30/07/2026 11:05',
    scope: 'Kiểm tra nhật ký',
  },
]

export function useAdmins() {
  const [admins] = useState<AdminRow[]>(seedAdmins)
  const [loading] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filters = [
    {
      key: 'role',
      label: 'Vai trò',
      options: [
        { label: 'Tất cả', value: '' },
        { label: 'Super Admin', value: 'Super Admin' },
        { label: 'System Admin', value: 'System Admin' },
        { label: 'Operations Admin', value: 'Operations Admin' },
        { label: 'Audit Admin', value: 'Audit Admin' },
      ],
    },
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { label: 'Tất cả', value: '' },
        { label: 'Hoạt động', value: 'Hoạt động' },
        { label: 'Tạm khóa', value: 'Tạm khóa' },
      ],
    },
  ]

  const filteredAdmins = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return admins.filter((admin) => {
      const matchesSearch =
        !query ||
        [admin.fullName, admin.email, admin.role, admin.status, admin.scope, admin.lastLoginAt]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesRole = !activeFilters.role || admin.role === activeFilters.role
      const matchesStatus =
        !activeFilters.status || admin.status === activeFilters.status

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [activeFilters.role, activeFilters.status, admins, searchTerm])

  const response = useMemo(
    () => ({
      totalElements: filteredAdmins.length,
      totalPages: Math.max(1, Math.ceil(filteredAdmins.length / pageSize)),
    }),
    [filteredAdmins.length, pageSize],
  )

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentIndex(0)
  }

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((current) => ({ ...current, [key]: value }))
    setCurrentIndex(0)
  }

  return {
    admins: filteredAdmins,
    loading,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    filters,
    handleFilterChange,
  }
}
