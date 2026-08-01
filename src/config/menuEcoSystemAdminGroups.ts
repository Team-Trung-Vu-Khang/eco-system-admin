import { ShieldCheck, UserCog, Users } from '../components/icons'

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
    ],
  },
] as const
