import { useMemo, useState } from 'react'
import { useLocation } from 'wouter'
import type { UserRow } from '../data/table'

const seedUsers: UserRow[] = [
  {
    id: 'u-1',
    fullName: 'Nguyễn Văn A',
    email: 'a@example.com',
    phone: '0901 234 567',
    referralName: 'Trần Thị B',
    role: 'Quản trị viên',
    status: 'Hoạt động',
    lastLoginAt: '31/07/2026 09:15',
    description: 'Quản trị viên chính của hệ thống, phụ trách cấu hình và phân quyền.',
  },
  {
    id: 'u-2',
    fullName: 'Trần Thị B',
    email: 'b@example.com',
    phone: '0902 345 678',
    referralName: 'Nguyễn Văn A',
    role: 'Người dùng',
    status: 'Hoạt động',
    lastLoginAt: '31/07/2026 13:42',
    description: 'Người dùng nội bộ, thường xuyên truy cập để theo dõi dữ liệu.',
  },
  {
    id: 'u-3',
    fullName: 'Lê Văn C',
    email: 'c@example.com',
    phone: '0903 456 789',
    referralName: 'Phạm Thị D',
    role: 'Người dùng',
    status: 'Khóa',
    lastLoginAt: '29/07/2026 18:20',
    description: 'Tài khoản đang tạm khóa do chưa xác nhận lại thông tin.',
  },
]

export function useUsers() {
  const [, setLocation] = useLocation()
  const [users, setUsers] = useState<UserRow[]>(seedUsers)
  const [loading] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [filters] = useState([
    {
      key: 'role',
      label: 'Vai trò',
      options: [
        { label: 'Tất cả', value: '' },
        { label: 'Quản trị viên', value: 'Quản trị viên' },
        { label: 'Người dùng', value: 'Người dùng' },
      ],
    },
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { label: 'Tất cả', value: '' },
        { label: 'Hoạt động', value: 'Hoạt động' },
        { label: 'Khóa', value: 'Khóa' },
      ],
    },
  ])
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [
          user.fullName,
          user.email,
          user.phone,
          user.referralName,
          user.role,
          user.status,
          user.lastLoginAt,
          user.description,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesRole =
        !activeFilters.role || user.role === activeFilters.role
      const matchesStatus =
        !activeFilters.status || user.status === activeFilters.status

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [activeFilters.role, activeFilters.status, searchTerm, users])

  const response = useMemo(
    () => ({
      totalElements: filteredUsers.length,
      totalPages: Math.max(1, Math.ceil(filteredUsers.length / pageSize)),
    }),
    [filteredUsers.length, pageSize],
  )

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentIndex(0)
  }

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((current) => ({ ...current, [key]: value }))
    setCurrentIndex(0)
  }

  const handleDelete = (user: UserRow) => {
    setSelectedUser(user)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    setIsDeleting(true)
    try {
      setUsers((current) => current.filter((user) => user.id !== selectedUser.id))
      setDeleteOpen(false)
      setSelectedUser(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleImportData = async () => {
    setImportOpen(false)
  }

  return {
    users: filteredUsers,
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
  }
}
