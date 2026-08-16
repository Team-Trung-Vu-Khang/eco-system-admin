import { Upload, Users } from "lucide-react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";

type UpdateUserReferralPageHeaderProps = {
  onUploadClick: () => void;
};

export function UpdateUserReferralPageHeader({
  onUploadClick,
}: UpdateUserReferralPageHeaderProps) {
  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          <Users className="h-3.5 w-3.5" />
          Quản trị hệ thống
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
            Cập nhật người được giới thiệu
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Danh sách học viên được giới thiệu. Cho phép gán hoặc thay đổi người
            giới thiệu tương ứng cho từng học viên.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button variant="outline" onClick={onUploadClick}>
          <Upload className="mr-2 h-4 w-4" />
          Nhập dữ liệu giới thiệu
        </Button>
      </div>
    </div>
  );
}
