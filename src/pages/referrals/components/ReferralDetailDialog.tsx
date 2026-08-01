import { useMemo } from "react";
import {
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReferralRow } from "../data/referrals";
import type { UserRow } from "../../users/data/table";

type ReferralDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detailReferral: ReferralRow | null;
  detailTab: "info" | "users";
  onTabChange: (tab: "info" | "users") => void;
  linkedUsers: UserRow[];
  onOpenUser: (userId: string) => void;
}

export function ReferralDetailDialog({
  open,
  onOpenChange,
  detailReferral,
  detailTab,
  onTabChange,
  linkedUsers,
  onOpenUser,
}: ReferralDetailDialogProps) {
  const linkedUserColumns: Column<UserRow>[] = useMemo(
    () => [
      { key: "fullName", label: "Họ và tên", sortable: true, width: "180px" },
      { key: "phone", label: "Số điện thoại", width: "150px" },
      { key: "email", label: "Email", width: "240px" },
      { key: "role", label: "Vai trò", width: "140px" },
      {
        key: "status",
        label: "Trạng thái",
        width: "140px",
        render: (value) => {
          const status = String(value);
          const variant = status === "Hoạt động" ? "secondary" : "destructive";

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        key: "id",
        label: "Hành động",
        width: "120px",
        render: (_, row) => (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenUser(row.id)}>
              Mở user
            </Button>
          </div>
        ),
      },
    ],
    [onOpenUser],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          onTabChange("info");
        }
      }}
    >
      <DialogContent className="w-[calc(40vw-1rem)] max-w-[calc(40vw-1rem)] overflow-hidden border-0 bg-white p-0 shadow-none">
        {detailReferral ? (
          <div className="bg-white px-6 py-6">
            <DialogHeader className="space-y-4">
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                  {detailReferral.fullName}
                </DialogTitle>
                <DialogDescription className="text-sm leading-6 text-slate-500">
                  Thông tin người giới thiệu được chuẩn hóa theo số điện thoại
                  đầu
                  <code>84</code>.
                </DialogDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    detailReferral.status === "Hoạt động"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {detailReferral.status}
                </Badge>
                <span className="text-sm text-slate-500">
                  Cập nhật gần nhất: {detailReferral.updatedAt}
                </span>
              </div>
            </DialogHeader>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onTabChange("info")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  detailTab === "info"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                Thông tin
              </button>
              <button
                type="button"
                onClick={() => onTabChange("users")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  detailTab === "users"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                Danh sách người dùng
              </button>
            </div>

            {detailTab === "info" ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Số điện thoại
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {detailReferral.phone}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Tên
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {detailReferral.fullName}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Tỉnh
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {detailReferral.province}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Trạng thái
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {detailReferral.status}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                {linkedUsers.length > 0 ? (
                  <div className="w-full min-w-0 overflow-x-auto pb-2">
                    <DataTable
                      columns={linkedUserColumns}
                      data={linkedUsers}
                      selectable={false}
                      loading={false}
                      pageSize={Math.max(1, linkedUsers.length)}
                      currentIndex={0}
                      totalElements={linkedUsers.length}
                      totalPages={1}
                      onPageSize={() => undefined}
                      onIndexChange={() => undefined}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    Chưa có người dùng nào được gắn với người giới thiệu này.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
