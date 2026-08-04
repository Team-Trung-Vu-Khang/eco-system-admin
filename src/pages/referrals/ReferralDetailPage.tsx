import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Users } from "lucide-react";
import {
  AutoCompleteSelect,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { UserRow } from "../users/data/table";
import { useUsers } from "../users/hooks/useUsers";
import {
  normalizePhoneTo84,
  referralStatusOptions,
  type ReferralFormErrors,
  type ReferralFormValues,
  type ReferralRow,
} from "./data/referrals";
import { useReferralsStore } from "./hooks/useReferralsStore";
import { getFeatureDuplicateMessage } from "@/constants/message.constant";

function validate(values: ReferralFormValues) {
  const errors: ReferralFormErrors = {};
  const normalizedPhone = normalizePhoneTo84(values.phone);

  if (!values.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
  else if (!normalizedPhone.startsWith("84")) {
    errors.phone = "Số điện thoại phải quy về đầu 84";
  }

  if (!values.fullName.trim()) errors.fullName = "Vui lòng nhập tên";
  if (!values.province.trim()) errors.province = "Vui lòng nhập tỉnh";
  if (!values.status.trim()) errors.status = "Vui lòng chọn trạng thái";

  return errors;
}

type ReferralDetailPageContentProps = {
  referral: ReferralRow;
  referrals: ReferralRow[];
  updateReferral: (id: string, values: ReferralFormValues) => void;
};

function ReferralDetailPageContent({
  referral,
  referrals,
  updateReferral,
}: ReferralDetailPageContentProps) {
  const [, setLocation] = useLocation();
  const {
    users,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
    handleConfirmDelete,
    isDeleting,
  } = useUsers();
  const [formValues, setFormValues] = useState<ReferralFormValues>(() => ({
    phone: referral.phone,
    fullName: referral.fullName,
    province: referral.province,
    status: referral.status,
  }));
  const [formErrors, setFormErrors] = useState<ReferralFormErrors>({});
  const [loading, setLoading] = useState(false);

  const provinceOptions = useMemo(() => {
    const values = Array.from(
      new Set(referrals.map((item) => item.province)),
    ).sort();

    return values.map((value) => ({ label: value, value }));
  }, [referrals]);

  const linkedUsers = useMemo(
    () => users.filter((user) => user.referralName === referral.fullName),
    [referral.fullName, users],
  );

  const userColumns: Column<UserRow>[] = useMemo(
    () => [
      { key: "fullName", label: "Họ và tên", sortable: true },
      { key: "phone", label: "Số điện thoại" },
      { key: "address", label: "Địa chỉ" },
      {
        key: "status",
        label: "Trạng thái",
        render: (value) => {
          const status = String(value);
          const variant = status === "Hoạt động" ? "secondary" : "destructive";

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      { key: "lastLoginAt", label: "Cập nhật gần nhất" },
    ],
    [],
  );

  const updateField = <K extends keyof ReferralFormValues>(
    key: K,
    value: ReferralFormValues[K],
  ) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const submitForm = async () => {
    const nextErrors = validate(formValues);
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const normalizedPhone = normalizePhoneTo84(formValues.phone);
    const duplicate = referrals.find(
      (item) => item.phone === normalizedPhone && item.id !== referral.id,
    );

    if (duplicate) {
      setFormErrors({
        phone: getFeatureDuplicateMessage("referrers"),
      });
      return;
    }

    setLoading(true);
    try {
      updateReferral(referral.id, {
        ...formValues,
        phone: normalizedPhone,
      });
      setLocation("/referrals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Chi tiết người giới thiệu
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Chỉnh sửa thông tin trực tiếp trên trang này, không dùng dialog.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={() => setLocation("/referrals")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              Thông tin người giới thiệu
            </p>
            <p className="text-sm leading-6 text-slate-500">
              Bổ sung hoặc cập nhật thông tin trực tiếp tại đây.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="referral-phone" required>
                Số điện thoại
              </Label>
              <Input
                id="referral-phone"
                value={formValues.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="0901 234 567"
                aria-invalid={Boolean(formErrors.phone)}
              />
              {formErrors.phone ? (
                <p className="text-sm text-rose-600">{formErrors.phone}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral-name" required>
                Họ và tên
              </Label>
              <Input
                id="referral-name"
                value={formValues.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                placeholder="Nhập họ và tên"
                aria-invalid={Boolean(formErrors.fullName)}
              />
              {formErrors.fullName ? (
                <p className="text-sm text-rose-600">{formErrors.fullName}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="referral-province" required>
                Tỉnh
              </Label>
              <AutoCompleteSelect
                value={formValues.province}
                onChange={(value) => updateField("province", value)}
                options={provinceOptions}
                placeholder="Chọn tỉnh"
                searchPlaceholder="Tìm theo tỉnh..."
                emptyText="Không tìm thấy tỉnh"
                clearable
                autocomplete
              />
              {formErrors.province ? (
                <p className="text-sm text-rose-600">{formErrors.province}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="referral-status" required>
                Trạng thái
              </Label>
              <Select
                value={formValues.status}
                onValueChange={(value) =>
                  updateField("status", value as ReferralFormValues["status"])
                }
              >
                <SelectTrigger
                  id="referral-status"
                  aria-invalid={Boolean(formErrors.status)}
                >
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {referralStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.status ? (
                <p className="text-sm text-rose-600">{formErrors.status}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Cập nhật gần nhất
              </div>
              <div className="text-sm font-medium text-slate-900">
                {referral.updatedAt}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Trạng thái hiện tại
              </div>
              <div className="text-sm font-medium text-slate-900">
                {referral.status}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setLocation("/referrals")}
            >
              Hủy
            </Button>
            <Button type="button" disabled={loading} onClick={submitForm}>
              Lưu thay đổi
            </Button>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              Danh sách người được giới thiệu
            </p>
            <p className="text-sm leading-6 text-slate-500">
              Chỉ hiển thị thao tác xoá, khi xoá sẽ có xác nhận.
            </p>
          </div>

          {linkedUsers.length > 0 ? (
            <DataTable
              columns={userColumns}
              data={linkedUsers}
              searchable={false}
              selectable={false}
              loading={false}
              pageSize={Math.max(1, linkedUsers.length)}
              currentIndex={0}
              totalElements={linkedUsers.length}
              totalPages={1}
              onPageSize={() => undefined}
              onIndexChange={() => undefined}
              onDelete={handleDelete}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
              Chưa có người dùng nào được gắn với người giới thiệu này.
            </div>
          )}
        </section>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa người dùng này? Hoạt động này không thể hoàn tác."
        loading={isDeleting}
      />
    </section>
  );
}

export function ReferralDetailPage() {
  const params = useParams<{ id: string }>();
  const referralId = params.id;
  const { referrals, updateReferral, getReferralById } = useReferralsStore();
  const referral = referralId ? getReferralById(referralId) : null;

  if (!referral) {
    return (
      <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
            Không tìm thấy người giới thiệu
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Bản ghi bạn mở không còn tồn tại hoặc đã bị xóa.
          </p>
        </div>

        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </section>
    );
  }

  return (
    <ReferralDetailPageContent
      key={referral.id}
      referral={referral}
      referrals={referrals}
      updateReferral={updateReferral}
    />
  );
}
