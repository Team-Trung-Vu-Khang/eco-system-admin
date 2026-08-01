import { Badge, type Column } from '@Team-Trung-Vu-Khang/eco-shared-ui'
import { getAdminDisplayPermissions, type AdminRow } from './admins'

export const adminColumns: Column<AdminRow>[] = [
  { key: 'fullName', label: 'Họ và tên', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Số điện thoại' },
  { key: 'role', label: 'Vai trò' },
  {
    key: 'permissions',
    label: 'Phân quyền',
    render: (value) => (
      <span className="text-sm text-slate-700">
        {getAdminDisplayPermissions(Array.isArray(value) ? value : [])}
      </span>
    ),
  },
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
