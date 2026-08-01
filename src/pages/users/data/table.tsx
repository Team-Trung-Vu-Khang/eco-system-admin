import { Badge, type Column } from '@Team-Trung-Vu-Khang/eco-shared-ui'

export type UserRow = {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  lastLoginAt: string
  description: string
}

export const userColumns: Column<UserRow>[] = [
  { key: 'fullName', label: 'Họ và tên', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Số điện thoại' },
  { key: 'role', label: 'Vai trò' },
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
