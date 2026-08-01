import { Badge, type Column } from '@Team-Trung-Vu-Khang/eco-shared-ui'

export type AdminRow = {
  id: string
  fullName: string
  email: string
  role: string
  status: string
  lastLoginAt: string
  scope: string
}

export const adminColumns: Column<AdminRow>[] = [
  { key: 'fullName', label: 'Họ và tên', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Vai trò' },
  { key: 'scope', label: 'Phạm vi' },
  { key: 'lastLoginAt', label: 'Đăng nhập gần nhất' },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (value) => {
      const status = String(value)
      const variant = status === 'Hoạt động' ? 'secondary' : 'destructive'

      return <Badge variant={variant}>{status}</Badge>
    },
  },
]
