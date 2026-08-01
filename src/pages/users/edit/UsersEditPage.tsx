import { useState } from 'react'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@Team-Trung-Vu-Khang/eco-shared-ui'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useLocation } from 'wouter'

type FormState = {
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  note: string
}

const initialForm: FormState = {
  fullName: 'Nguyễn Văn A',
  email: 'a@example.com',
  phone: '0901 234 567',
  role: 'Quản trị viên',
  status: 'Hoạt động',
  note: 'Người dùng mẫu để chỉnh sửa.',
}

export function UsersEditPage() {
  const [, setLocation] = useLocation()
  const [form, setForm] = useState<FormState>(initialForm)

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocation('/users')
  }

  return (
    <section className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Pencil className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Chỉnh sửa người dùng
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Cập nhật thông tin người dùng. Không chỉnh sửa trường đăng nhập gần
              nhất ở đây.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setLocation('/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
              Họ và tên
            </label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="user@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700">
              Số điện thoại
            </label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="0901 234 567"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium text-slate-700">
              Vai trò
            </label>
            <Select value={form.role} onValueChange={(value) => updateField('role', value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Người dùng">Người dùng</SelectItem>
                <SelectItem value="Quản trị viên">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-slate-700">
              Trạng thái
            </label>
            <Select
              value={form.status}
              onValueChange={(value) => updateField('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                <SelectItem value="Khóa">Khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="note" className="text-sm font-medium text-slate-700">
            Ghi chú
          </label>
          <Textarea
            id="note"
            value={form.note}
            onChange={(e) => updateField('note', e.target.value)}
            placeholder="Nhập ghi chú cho người dùng..."
            className="min-h-32"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-4">
          <Button variant="outline" type="button" onClick={() => setLocation('/users')}>
            Hủy
          </Button>
          <Button type="submit">Lưu thay đổi</Button>
        </div>
      </form>
    </section>
  )
}
