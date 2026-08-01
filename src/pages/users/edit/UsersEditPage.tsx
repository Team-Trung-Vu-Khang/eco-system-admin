import { ArrowLeft, Pencil } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { accountPlatforms, createPlatformGrants } from "../data/permissions";
import {
  UserAccountForm,
  type UserAccountFormValues,
} from "../components/UserAccountForm";

export function UsersEditPage() {
  const [, setLocation] = useLocation();
  const initialValues: UserAccountFormValues = {
    fullName: "Nguyễn Văn A",
    email: "a@example.com",
    phone: "0901 234 567",
    birthYear: "1992",
    address: "Q.1, TP.HCM",
    referralName: "Trần Thị B",
    status: "active",
    note: "Người dùng mẫu để chỉnh sửa.",
    platformGrants: createPlatformGrants(
      accountPlatforms.map((platform) => platform.value),
      "admin",
    ),
  };

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Pencil className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Chỉnh sửa tài khoản
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Cập nhật thông tin người dùng và điều chỉnh quyền theo từng phân
              hệ.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setLocation("/users")}>
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
