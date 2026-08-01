import { useMemo, useState } from 'react'
import { useLocation } from 'wouter'
import { type AdminRow, adminRoleOptions, adminStatusOptions } from '../data/admins'
import { useAdminsStore } from './useAdminsStore'

export function useAdmins() {
  const [, setLocation] = useLocation()
  const { admins, deleteAdmin } = useAdminsStore()
  const [loading] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRow | null>(null)

  const filters = [
    {
      key: 'role',
      label: 'Vai trò',
      options: [
        { label: 'Tất cả', value: '' },
        ...adminRoleOptions,
      ],
    },
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { label: 'Tất cả', value: '' },
        ...adminStatusOptions,
      ],
    },
  ]

  const filteredAdmins = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return admins.filter((admin) => {
      const matchesSearch =
        !query ||
        [
          admin.fullName,
          admin.email,
          admin.phone,
          admin.role,
          admin.status,
          admin.permissions.join(' '),
          admin.lastLoginAt,
          admin.description,
        ]
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

  const handleDelete = (admin: AdminRow) => {
    setSelectedAdmin(admin)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return

    deleteAdmin(selectedAdmin.id)
    setDeleteOpen(false)
    setSelectedAdmin(null)
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
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    setLocation,
  }
}
