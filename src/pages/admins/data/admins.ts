export type AdminRow = {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  permissions: string[]
  lastLoginAt: string
  description: string
}

export type AdminFormValues = {
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  permissions: string[]
  note: string
}

export const adminRoleOptions = [
  { label: 'Super Admin', value: 'Super Admin' },
  { label: 'System Admin', value: 'System Admin' },
  { label: 'Operations Admin', value: 'Operations Admin' },
  { label: 'Audit Admin', value: 'Audit Admin' },
]

export const adminStatusOptions = [
  { label: 'Hoạt động', value: 'Hoạt động' },
  { label: 'Tạm khóa', value: 'Tạm khóa' },
]

export const adminPermissionOptions = [
  { label: 'Admin Farm', value: 'Admin Farm' },
  { label: 'Admin Edu', value: 'Admin Edu' },
  { label: 'Admin Factory', value: 'Admin Factory' },
  { label: 'Admin Shop', value: 'Admin Shop' },
  { label: 'Admin System', value: 'Admin System' },
]

export const adminStorageKey = 'eco-system-admin-admins'

export const seedAdmins: AdminRow[] = [
  {
    id: 'a-1',
    fullName: 'Nguyễn Văn Huy',
    email: 'huy.nguyen@ecosystem.vn',
    phone: '0901 234 111',
    role: 'Super Admin',
    status: 'Hoạt động',
    permissions: ['Admin System', 'Admin Farm', 'Admin Edu'],
    lastLoginAt: '31/07/2026 09:12',
    description: 'Quản trị viên chính của hệ thống, phụ trách cấu hình lõi.',
  },
  {
    id: 'a-2',
    fullName: 'Trần Minh Thảo',
    email: 'thao.tran@ecosystem.vn',
    phone: '0901 234 222',
    role: 'System Admin',
    status: 'Hoạt động',
    permissions: ['Admin System', 'Admin Shop'],
    lastLoginAt: '31/07/2026 15:38',
    description: 'Phụ trách quản lý tài khoản và nhóm quyền.',
  },
  {
    id: 'a-3',
    fullName: 'Lê Quốc Bảo',
    email: 'bao.le@ecosystem.vn',
    phone: '0901 234 333',
    role: 'Operations Admin',
    status: 'Tạm khóa',
    permissions: ['Admin Factory', 'Admin Shop'],
    lastLoginAt: '29/07/2026 18:20',
    description: 'Được cấp quyền vận hành trong các nghiệp vụ hàng ngày.',
  },
  {
    id: 'a-4',
    fullName: 'Phạm Thị Linh',
    email: 'linh.pham@ecosystem.vn',
    phone: '0901 234 444',
    role: 'Audit Admin',
    status: 'Hoạt động',
    permissions: ['Admin Edu', 'Admin System'],
    lastLoginAt: '30/07/2026 11:05',
    description: 'Theo dõi lịch sử thao tác và rà soát nhật ký hệ thống.',
  },
]

export const initialAdminFormValues: AdminFormValues = {
  fullName: '',
  email: '',
  phone: '',
  role: 'System Admin',
  status: 'Hoạt động',
  permissions: [],
  note: '',
}

export function getAdminDisplayPermissions(permissions: string[]) {
  return permissions.length > 0 ? permissions.join(', ') : 'Chưa phân quyền'
}

export function buildAdminDescription(values: AdminFormValues) {
  const note = values.note.trim()
  if (note) return note

  const permissions = values.permissions.length
    ? values.permissions.join(', ')
    : 'chưa chọn phân quyền'

  return `${values.role} phụ trách ${permissions}.`
}

export function formatAdminNow() {
  const date = new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}
