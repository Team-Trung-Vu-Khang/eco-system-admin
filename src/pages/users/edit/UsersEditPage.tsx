import { useMemo, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useLocation, useParams } from "wouter";
import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useUserQuery,
} from "@/api/users/users.hooks";
import type { UserDetailResponse } from "@/api/users/users.response";
import { getApiErrorDescription } from "@/lib/api-error";
import {
  UserAccountForm,
  type UserAccountFormValues,
} from "../components/UserAccountForm";

function mapUserDetailToFormValues(
  user: UserDetailResponse,
): UserAccountFormValues {
  return {
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber ?? user.username,
    operatingArea: user.operatingArea ?? "",
    birthYear: String(user.birthYear),
    referrerPhoneNumber: user.referrer?.phoneNumber ?? "",
    audienceType: user.audienceType ?? "other",
    roles: user.roleCodes,
  };
}

export function UsersEditPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const userId = params.id ? Number(params.id) : null;
  const resolvedUserId = Number.isNaN(userId ?? NaN) ? null : userId;
  const userQuery = useUserQuery(resolvedUserId);
  const updateUserMutation = useUpdateUserMutation();
  const updateStatusMutation = useUpdateUserStatusMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (resolvedUserId === null) {
    return (
      <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Pencil className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 md:text-4xl">
            Đường dẫn tài khoản không hợp lệ
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Vui lòng mở trang chỉnh sửa với một `userId` hợp lệ.
          </p>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => setLocation("/users")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </section>
    );
  }

  const initialValues = useMemo(
    () => (userQuery.data ? mapUserDetailToFormValues(userQuery.data) : null),
    [userQuery.data],
  );

  if (userQuery.isPending) {
    return (
      <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Pencil className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 md:text-4xl">
            Đang tải thông tin tài khoản
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Hệ thống đang lấy dữ liệu chi tiết của tài khoản để hiển thị lên
            form chỉnh sửa.
          </p>
        </div>
      </section>
    );
  }

  if (userQuery.isError) {
    return (
      <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Pencil className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 md:text-4xl">
            Không tìm thấy tài khoản
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Tài khoản bạn đang mở không tồn tại hoặc không thể tải dữ liệu.
          </p>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => setLocation("/users")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </section>
    );
  }

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

          {userQuery.data ? (
            <>
              <Button
                variant={
                  userQuery.data.status === "active"
                    ? "destructive"
                    : "secondary"
                }
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={() => setIsConfirmOpen(true)}
              >
                {userQuery.data.status === "active"
                  ? "Khóa tài khoản"
                  : "Mở tài khoản"}
              </Button>

              <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {userQuery.data.status === "active"
                        ? "Khóa tài khoản"
                        : "Mở tài khoản"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {userQuery.data.status === "active"
                        ? "Bạn có chắc chắn muốn khóa tài khoản này không? Hành động này sẽ hủy mọi phiên đăng nhập hiện tại của người dùng."
                        : "Bạn có chắc chắn muốn mở khóa tài khoản này không?"}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={updateStatusMutation.isPending}
                    >
                      Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className={cn(
                        "border-0",
                        userQuery.data.status === "active"
                          ? "bg-red-500 hover:bg-red-600 hover:text-white"
                          : undefined,
                      )}
                      disabled={updateStatusMutation.isPending}
                      onClick={async (e) => {
                        e.preventDefault();
                        const isLocking = userQuery.data.status === "active";
                        try {
                          await updateStatusMutation.mutateAsync({
                            userId: resolvedUserId!,
                            status: isLocking ? "inactive" : "active",
                          });
                          toast({
                            title: isLocking
                              ? "Đã khóa tài khoản"
                              : "Đã mở khóa tài khoản",
                            duration: 2000,
                          });
                          setIsConfirmOpen(false);
                        } catch (error) {
                          console.error(error);
                          toast({
                            title: "Lỗi cập nhật trạng thái",
                            description: getApiErrorDescription(
                              error,
                              "Không thể cập nhật trạng thái tài khoản.",
                            ),
                            variant: "destructive",
                            duration: 2000,
                          });
                        }
                      }}
                    >
                      Xác nhận
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : null}
        </div>
      </div>

      <UserAccountForm
        mode="edit"
        title="Thông tin tài khoản"
        description="Chỉ cập nhật khu vực hoạt động của tài khoản."
        submitLabel={
          updateUserMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"
        }
        initialValues={initialValues ?? undefined}
        submitting={updateUserMutation.isPending}
        onSubmit={async (values) => {
          try {
            await updateUserMutation.mutateAsync({
              userId: resolvedUserId,
              fullName: values.fullName,
              email: values.email || null,
              operatingArea: values.operatingArea || null,
              birthYear: values.birthYear ? Number(values.birthYear) : null,
              audienceType: values.audienceType || null,
            });

            toast({
              title: "Cập nhật tài khoản thành công",
              description: "Thông tin tài khoản đã được lưu lại.",
              duration: 2000,
            });
          } catch (error) {
            console.error(error);
            toast({
              title: "Không thể cập nhật tài khoản",
              description: getApiErrorDescription(
                error,
                "Vui lòng kiểm tra lại thông tin và thử lại.",
              ),
              variant: "destructive",
              duration: 2000,
            });
          }
        }}
        onCancel={() => setLocation("/users")}
      />
    </section>
  );
}
