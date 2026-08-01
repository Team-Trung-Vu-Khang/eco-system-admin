import {
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { UserRound } from "lucide-react";
import type { AdminRow } from "../data/admins";

type AdminDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: AdminRow | null;
};

export function AdminDetailDialog({
  open,
  onOpenChange,
  admin,
}: AdminDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border-0 bg-white p-0 shadow-none sm:max-w-2xl">
        {admin ? (
          <div className="bg-white px-6 py-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                    {admin.fullName}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm leading-6 text-slate-500">
                    {admin.description}
                  </DialogDescription>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={admin.status === "Hoạt động" ? "secondary" : "destructive"}
                >
                  {admin.status}
                </Badge>
                <span className="text-sm text-slate-500">
                  Đăng nhập gần nhất: {admin.lastLoginAt}
                </span>
              </div>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {admin.email}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Số điện thoại
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {admin.phone}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Vai trò
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {admin.role}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Phân quyền
                </div>
                <div className="flex flex-wrap gap-2">
                  {admin.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
