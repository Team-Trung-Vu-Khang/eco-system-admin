import { useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, Pencil, Plus } from 'lucide-react'
import { useLocation } from 'wouter'
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@Team-Trung-Vu-Khang/eco-shared-ui'
import {
  adminPermissionOptions,
  adminRoleOptions,
  adminStatusOptions,
  buildAdminDescription,
  formatAdminNow,
  initialAdminFormValues,
  type AdminFormValues,
  type AdminRow,
} from './data/admins'
import { buildAdminFormValues, useAdminsStore } from './hooks/useAdminsStore'

type AdminFormMode = 'create' | 'edit'

type AdminFormPageProps = {
  mode: AdminFormMode
  adminId?: string
}

type AdminFormErrors = Partial<Record<keyof AdminFormValues, string>>

function validate(values: AdminFormValues) {
  const errors: AdminFormErrors = {}

  if (!values.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên'
  if (!values.email.trim()) errors.email = 'Vui lòng nhập email'
  if (!values.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại'
  if (!values.role.trim()) errors.role = 'Vui lòng chọn vai trò'
  if (!values.status.trim()) errors.status = 'Vui lòng chọn trạng thái'
  if (values.permissions.length === 0) {
    errors.permissions = 'Vui lòng chọn ít nhất một phân quyền'
  }

  return errors
}

function PermissionToggle({
  label,
  active,
  onToggle,
}: {
  label: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'rounded-2xl border px-4 py-3 text-left text-sm font-medium transition',
        active
          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
          : 'border-black/10 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export function AdminFormPage({ mode, adminId }: AdminFormPageProps) {
  const [, setLocation] = useLocation()
  const { getAdminById, createAdmin, updateAdmin } = useAdminsStore()
  const existingAdmin = useMemo(
    () => (mode === 'edit' && adminId ? getAdminById(adminId) : null),
    [adminId, getAdminById, mode],
  )
  const [form, setForm] = useState<AdminFormValues>(
    mode === 'edit' ? buildAdminFormValues(existingAdmin) : initialAdminFormValues,
  )
  const [errors, setErrors] = useState<AdminFormErrors>({})
  const [saving, setSaving] = useState(false)

  const title = mode === 'create' ? 'Thêm quản trị viên' : 'Chỉnh sửa quản trị viên'
  const subtitle =
    mode === 'create'
      ? 'Tạo mới một tài khoản quản trị và gán phân quyền cho từng hệ thống.'
      : 'Cập nhật thông tin quản trị viên và điều chỉnh phân quyền nếu cần.'
  const icon = mode === 'create' ? Plus : Pencil
  const Icon = icon

  const updateField = <K extends keyof AdminFormValues>(key: K, value: AdminFormValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const togglePermission = (permission: string) => {
    setForm((current) => {
      const exists = current.permissions.includes(permission)
      return {
        ...current,
        permissions: exists
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission],
      }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const nextAdmin: AdminRow = {
        id: existingAdmin?.id ?? `a-${Date.now()}`,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        status: form.status,
        permissions: form.permissions,
        lastLoginAt: existingAdmin?.lastLoginAt ?? formatAdminNow(),
        description: buildAdminDescription(form),
      }

      if (mode === 'create') {
        createAdmin(nextAdmin)
      } else if (existingAdmin) {
        updateAdmin(existingAdmin.id, nextAdmin)
      }

      setLocation('/admins')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Icon className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setLocation('/admins')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>

      {mode === 'edit' && !existingAdmin ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Không tìm thấy quản trị viên cần chỉnh sửa.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" required>
              Họ và tên
            </Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              placeholder="Nhập họ và tên"
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName ? <p className="text-sm text-rose-600">{errors.fullName}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="admin@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <p className="text-sm text-rose-600">{errors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" required>
              Số điện thoại
            </Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="0901 234 567"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? <p className="text-sm text-rose-600">{errors.phone}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" required>
              Vai trò
            </Label>
            <Select value={form.role} onValueChange={(value) => updateField('role', value)}>
              <SelectTrigger id="role" aria-invalid={Boolean(errors.role)}>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {adminRoleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role ? <p className="text-sm text-rose-600">{errors.role}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" required>
              Trạng thái
            </Label>
            <Select value={form.status} onValueChange={(value) => updateField('status', value)}>
              <SelectTrigger id="status" aria-invalid={Boolean(errors.status)}>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {adminStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status ? <p className="text-sm text-rose-600">{errors.status}</p> : null}
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label required>Phân quyền</Label>
            <p className="text-sm text-slate-500">
              Có thể chọn nhiều quyền cùng lúc cho một quản trị viên.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {adminPermissionOptions.map((permission) => (
              <PermissionToggle
                key={permission.value}
                label={permission.label}
                active={form.permissions.includes(permission.value)}
                onToggle={() => togglePermission(permission.value)}
              />
            ))}
          </div>

          {errors.permissions ? (
            <p className="text-sm text-rose-600">{errors.permissions}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Textarea
            id="note"
            value={form.note}
            onChange={(event) => updateField('note', event.target.value)}
            placeholder="Mô tả trách nhiệm hoặc lưu ý cho quản trị viên này..."
            className="min-h-32"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-4">
          <Button variant="outline" type="button" onClick={() => setLocation('/admins')}>
            Hủy
          </Button>
          <Button type="submit" disabled={saving}>
            {mode === 'create' ? 'Tạo quản trị viên' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </section>
  )
}
