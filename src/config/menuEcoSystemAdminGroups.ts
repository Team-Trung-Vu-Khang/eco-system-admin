import { ShieldCheck, UserCog, Users } from '../components/icons'
import { Users2 } from 'lucide-react'

export const menuEcoSystemAdminGroups = [
  {
    title: 'Quản trị hệ thống',
    items: [
      {
        id: 'system-user',
        label: 'Quản lý người dùng',
        icon: Users,
        href: '/users',
      },
      {
        id: 'system-admin',
        label: 'Quản trị viên',
        icon: UserCog,
        href: '/admins',
      },
      {
        id: 'system-permission',
        label: 'Phân quyền',
        icon: ShieldCheck,
        href: '/permissions',
      },
      {
        id: 'system-referrals',
        label: 'Người giới thiệu',
        icon: Users2,
        href: '/referrals',
      },
    ],
  },
] as const
