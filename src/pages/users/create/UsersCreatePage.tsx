import { useLocation } from 'wouter'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@Team-Trung-Vu-Khang/eco-shared-ui'
import { ArrowLeft, UserPlus } from 'lucide-react'

const userCreateSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^[0-9+\s()-]+$/, 'Số điện thoại không hợp lệ'),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
  note: z.string().optional(),
})

type UserCreateFormValues = z.infer<typeof userCreateSchema>

const initialValues: UserCreateFormValues = {
  fullName: '',
  email: '',
  phone: '',
  role: 'Người dùng',
  note: '',
}

export function UsersCreatePage() {
  const [, setLocation] = useLocation()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateFormValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: initialValues,
  })

  const onSubmit = async () => {
    setLocation('/users')
  }

  return (
    <section className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <UserPlus className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Thêm người dùng
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Tạo mới một người dùng trong hệ thống. Form này đang dùng `zod`
              để validate dữ liệu nhập vào.
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

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" required>
              Họ và tên
            </Label>
            <Controller
              control={control}
              name="fullName"
              render={({ field }) => (
                <Input
                  id="fullName"
                  {...field}
                  placeholder="Nhập họ và tên"
                  aria-invalid={Boolean(errors.fullName)}
                />
              )}
            />
            {errors.fullName ? (
              <p className="text-sm text-rose-600">{errors.fullName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  {...field}
                  placeholder="user@example.com"
                  aria-invalid={Boolean(errors.email)}
                />
              )}
            />
            {errors.email ? (
              <p className="text-sm text-rose-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" required>
              Số điện thoại
            </Label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  id="phone"
                  {...field}
                  placeholder="0901 234 567"
                  aria-invalid={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone ? (
              <p className="text-sm text-rose-600">{errors.phone.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" required>
              Vai trò
            </Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role" aria-invalid={Boolean(errors.role)}>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Người dùng">Người dùng</SelectItem>
                    <SelectItem value="Quản trị viên">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role ? (
              <p className="text-sm text-rose-600">{errors.role.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Textarea
                id="note"
                {...field}
                placeholder="Nhập ghi chú cho người dùng..."
                className="min-h-32"
              />
            )}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-4">
          <Button variant="outline" type="button" onClick={() => setLocation('/users')}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Tạo người dùng
          </Button>
        </div>
      </form>
    </section>
  )
}
