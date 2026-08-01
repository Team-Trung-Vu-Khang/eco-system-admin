import { useEffect, useState } from 'react'
import {
  adminStorageKey,
  seedAdmins,
  type AdminFormValues,
  type AdminRow,
} from '../data/admins'

function readAdmins() {
  if (typeof window === 'undefined') return seedAdmins

  const raw = window.localStorage.getItem(adminStorageKey)
  if (!raw) return seedAdmins

  try {
    const parsed = JSON.parse(raw) as AdminRow[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedAdmins
  } catch {
    return seedAdmins
  }
}

export function useAdminsStore() {
  const [admins, setAdmins] = useState<AdminRow[]>(() => readAdmins())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(adminStorageKey, JSON.stringify(admins))
    }
  }, [admins])

  const getAdminById = (id: string) =>
    admins.find((admin) => admin.id === id) ?? null

  const createAdmin = (admin: AdminRow) => {
    setAdmins((current) => [admin, ...current])
  }

  const updateAdmin = (id: string, next: AdminRow) => {
    setAdmins((current) => current.map((admin) => (admin.id === id ? next : admin)))
  }

  const deleteAdmin = (id: string) => {
    setAdmins((current) => current.filter((admin) => admin.id !== id))
  }

  return {
    admins,
    setAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
  }
}

export function buildAdminFormValues(admin?: AdminRow | null): AdminFormValues {
  if (!admin) {
    return {
      fullName: '',
      email: '',
      phone: '',
      role: 'System Admin',
      status: 'Hoạt động',
      permissions: [],
      note: '',
    }
  }

  return {
    fullName: admin.fullName,
    email: admin.email,
    phone: admin.phone,
    role: admin.role,
    status: admin.status,
    permissions: admin.permissions,
    note: admin.description,
  }
}
