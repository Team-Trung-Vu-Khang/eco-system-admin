import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Users } from "lucide-react";
import {
  Button,
  AutoCompleteSelect,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCreateReferrerMutation } from "@/api/referrers/referrers.hooks";
import {
  initialReferralFormValues,
  normalizePhoneTo84,
  type ReferralFormErrors,
  type ReferralFormValues,
} from "./data/referrals";
import { useProvincesQuery } from "@/api/provinces/provinces.hooks";

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

export function ReferralCreatePage() {
  const [, setLocation] = useLocation();
  const provincesQuery = useProvincesQuery({
    status: "active",
    page: 0,
    size: 100,
  });
  const createReferrerMutation = useCreateReferrerMutation();
  const [formValues, setFormValues] = useState<ReferralFormValues>(
    initialReferralFormValues,
  );
  const [formErrors, setFormErrors] = useState<ReferralFormErrors>({});
  const [submitError, setSubmitError] = useState("");

  const provinceOptions = useMemo(() => {
    return (
      provincesQuery.data?.content.map((province) => ({
        label: province.fullName,
        value: province.fullName,
      })) ?? []
    );
  }, [provincesQuery.data?.content]);

  const onSubmit = async () => {
    const nextErrors = validate(formValues);
    setFormErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length > 0) return;

    const normalizedPhone = normalizePhoneTo84(formValues.phone);
    try {
      await createReferrerMutation.mutateAsync({
        phoneNumber: normalizedPhone,
        fullName: formValues.fullName.trim(),
        province: formValues.province.trim(),
      });
      setLocation("/referrals");
    } catch (error) {
      console.error(error);
      setSubmitError("Không thể tạo người giới thiệu. Vui lòng thử lại.");
    }
  };

  const updateField = <K extends keyof ReferralFormValues>(
    key: K,
    value: ReferralFormValues[K],
  ) => {
    setFormValues((current) => ({ ...current, [key]: value }));
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
              Tạo người giới thiệu
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Nhập số điện thoại, tên và tỉnh. Số điện thoại sẽ tự động chuẩn
              hóa về đầu 84.
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

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="referral-name" required>
            Họ và tên
          </Label>
          <Input
            id="referral-name"
            value={formValues.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Nhập người giới thiệu"
            aria-invalid={Boolean(formErrors.fullName)}
          />
          {formErrors.fullName ? (
            <p className="text-sm text-rose-600">{formErrors.fullName}</p>
          ) : null}
        </div>
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
              <SelectItem value="Hoạt động">Hoạt động</SelectItem>
              <SelectItem value="Khoá">Khoá</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.status ? (
            <p className="text-sm text-rose-600">{formErrors.status}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-4">
        {submitError ? (
          <p className="mr-auto text-sm text-rose-600">{submitError}</p>
        ) : null}
        <Button
          variant="outline"
          type="button"
          onClick={() => setLocation("/referrals")}
        >
          Hủy
        </Button>
        <Button
          type="button"
          disabled={createReferrerMutation.isPending}
          onClick={onSubmit}
        >
          Tạo thông tin
        </Button>
      </div>
    </section>
  );
}
