import { Plus, UserCog } from "lucide-react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";

type AdminsPageHeaderProps = {
  onCreateClick: () => void;
};

export function AdminsPageHeader({ onCreateClick }: AdminsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          <UserCog className="h-3.5 w-3.5" />
          Quản trị hệ thống
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
            Quản trị viên
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Danh sách tài khoản quản trị. Bạn có thể tạo mới, chỉnh sửa theo
            từng trang riêng và gán phân quyền cho Admin Farm, Admin Edu, Admin
            Factory, Admin Shop, Admin System.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm quản trị viên
        </Button>
      </div>
    </div>
  );
}
