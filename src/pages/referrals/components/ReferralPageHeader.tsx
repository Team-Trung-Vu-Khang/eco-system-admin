import { Plus, Upload, Users } from "lucide-react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";

type ReferralPageHeaderProps = {
  onUploadClick: () => void;
  onCreateClick: () => void;
}

export function ReferralPageHeader({
  onUploadClick,
  onCreateClick,
}: ReferralPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          <Users className="h-3.5 w-3.5" />
          Quản trị hệ thống
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
            Quản lý người giới thiệu
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Danh sách tài khoản người giới thiệu. Có thể upload, tạo mới hoặc
            sửa thông tin theo số điện thoại, tên và tỉnh.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onUploadClick}>
          <Upload className="mr-2 h-4 w-4" />
          Nhập dữ liệu
        </Button>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo thông tin
        </Button>
      </div>
    </div>
  )
}
