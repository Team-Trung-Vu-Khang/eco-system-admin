import { ArrowLeft, Pencil } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  UserAccountForm,
  type UserAccountFormValues,
} from "../components/UserAccountForm";

export function UsersEditPage() {
  const [, setLocation] = useLocation();
  const initialValues: UserAccountFormValues = {
    fullName: "Nguyễn Văn A",
    email: "a@example.com",
    phoneNumber: "0901 234 567",
    operatingArea: "Q.1, TP.HCM",
    birthYear: "1992",
    referrerPhoneNumber: "0902 345 678",
    audienceType: "business",
    roles: ["MEVI_SUPER_ADMIN", "MEVI_EDU_TRAINEES"],
  };

  return (
    <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Pencil className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 md:text-4xl">
              Chỉnh sửa tài khoản
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Cập nhật thông tin người dùng và điều chỉnh quyền theo từng phân
              hệ.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => setLocation("/users")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>

      <UserAccountForm
        title="Thông tin tài khoản"
        description="Cập nhật thông tin định danh và điều chỉnh vai trò của từng phân hệ đang được gán cho tài khoản."
        submitLabel="Lưu thay đổi"
        initialValues={initialValues}
        onSubmit={() => setLocation("/users")}
        onCancel={() => setLocation("/users")}
      />
    </section>
  );
}
