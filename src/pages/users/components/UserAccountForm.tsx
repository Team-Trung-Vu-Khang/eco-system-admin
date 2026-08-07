import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AutoCompleteSelect,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AutoCompleteOption } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useReferrersQuery } from "@/api/referrers/referrers.hooks";
import { useProvincesQuery } from "@/api/provinces/provinces.hooks";
import { useWardsQuery } from "@/api/wards/wards.hooks";
import type { AdminUserAudienceType } from "@/api/users/users.request";

const audienceTypeOptions = [
  { value: "individual", label: "Cá nhân" },
  { value: "cooperative", label: "Hợp tác xã" },
  { value: "business", label: "Doanh nghiệp" },
  { value: "other", label: "Khác" },
] as const;

const allRoleOptions = [
  {
    code: "MEVI_SUPER_ADMIN",
    label: "Quản trị tổng",
    group: "Hệ thống",
  },
  {
    code: "MEVI_REFERRER",
    label: "Người giới thiệu",
    group: "Hệ thống",
  },
  { code: "MEVI_ADMIN", label: "Quản trị hệ thống", group: "Hệ thống" },
  {
    code: "MEVI_EDU_ADMIN",
    label: "Quản trị giáo dục",
    group: "Trung tâm học tập MEVI",
  },
  {
    code: "MEVI_EDU_TRAINEES",
    label: "Học viên",
    group: "Trung tâm học tập MEVI",
  },
  {
    code: "MEVI_EDU_LECTURER",
    label: "Giảng viên",
    group: "Trung tâm học tập MEVI",
  },
  {
    code: "MEVI_FARM_ADMIN",
    label: "Quản trị trang trại",
    group: "Trang trại MEVI",
  },
  {
    code: "MEVI_FARM_MEMBER",
    label: "Thành viên trang trại",
    group: "Trang trại MEVI",
  },
  {
    code: "MEVI_FACTORY_ADMIN",
    label: "Quản trị nhà máy",
    group: "Mạng lưới nhà máy/cơ sở chế biến MEVI",
  },
  {
    code: "MEVI_FACTORY_MEMBER",
    label: "Thành viên nhà máy",
    group: "Mạng lưới nhà máy/cơ sở chế biến MEVI",
  },
  {
    code: "MEVI_SHOP_ADMIN",
    label: "Quản trị cửa hàng",
    group: "Trạm xanh MEVI",
  },
  {
    code: "MEVI_SHOP_MEMBER",
    label: "Thành viên cửa hàng",
    group: "Trạm xanh MEVI",
  },
] as const;

const selectableRoleOptions = allRoleOptions.filter(
  (item) => item.code !== "MEVI_SUPER_ADMIN" && item.code !== "MEVI_REFERRER",
);

const roleCodes: string[] = allRoleOptions.map((item) => item.code);

function toSearchableText(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizePhoneSearch(value?: string) {
  return value?.replace(/\D/g, "") ?? "";
}

function buildReferrerLabel(fullName?: string, phoneNumber?: string) {
  const name = fullName?.trim() ?? "";
  const account = phoneNumber?.trim() ?? "";

  return [name, account].filter(Boolean).join(" - ");
}

export const userAccountFormSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập họ và tên"),
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^(?:\+?84|0)(3|5|7|8|9)\d{8}$/, "Số điện thoại không hợp lệ"),
  operatingArea: z.string().trim().min(1, "Vui lòng nhập khu vực hoạt động"),
  birthYear: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập năm sinh")
    .regex(/^\d{4}$/, "Năm sinh phải gồm 4 chữ số"),
  referrerPhoneNumber: z.string().trim().optional(),
  province: z.string().trim().optional(),
  commune: z.string().trim().optional(),
  audienceType: z.enum(["individual", "cooperative", "business", "other"]),
  roles: z
    .array(z.string().min(1))
    .min(1, "Vui lòng chọn ít nhất một vai trò")
    .refine(
      (values) => values.every((value) => roleCodes.includes(value)),
      "Vai trò không hợp lệ",
    ),
});

export type UserAccountFormValues = z.infer<typeof userAccountFormSchema>;

type UserAccountFormProps = {
  mode?: "create" | "edit";
  title: string;
  description: string;
  submitLabel: string;
  initialValues?: UserAccountFormValues;
  submitting?: boolean;
  onSubmit: (values: UserAccountFormValues) => void | Promise<void>;
  onCancel: () => void;
};

const defaultValues: UserAccountFormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  operatingArea: "",
  birthYear: "",
  referrerPhoneNumber: "",
  province: "",
  commune: "",
  audienceType: "other",
  roles: [],
};

function fieldErrorMessage(error?: { message?: string }) {
  return error?.message;
}

export function UserAccountForm({
  mode = "create",
  title,
  description,
  submitLabel,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}: UserAccountFormProps) {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserAccountFormValues>({
    resolver: zodResolver(userAccountFormSchema),
    defaultValues: initialValues ?? defaultValues,
    mode: "onSubmit",
  });

  const referrersQuery = useReferrersQuery({
    page: 0,
    size: 100,
  });

  const provincesQuery = useProvincesQuery({
    page: 0,
    size: 100,
  });

  const selectedProvinceName = watch("province");
  const selectedProvinceCode = useMemo(() => {
    return provincesQuery.data?.content.find(
      (p) => p.name === selectedProvinceName,
    )?.code;
  }, [provincesQuery.data?.content, selectedProvinceName]);

  const wardsQuery = useWardsQuery({
    provinceCode: selectedProvinceCode || "",
    page: 0,
    size: 100,
  });

  useEffect(() => {
    reset(initialValues ?? defaultValues);
  }, [initialValues, reset]);

  const referrerPhoneOptions = useMemo<AutoCompleteOption[]>(() => {
    return (referrersQuery.data?.content ?? []).flatMap((item) => {
      const phoneNumber = item.phoneNumber?.trim() ?? "";

      if (!phoneNumber) {
        return [];
      }

      const label = buildReferrerLabel(item.fullName, phoneNumber);
      const fullNameTokens =
        item.fullName?.trim().toLowerCase().split(/\s+/).filter(Boolean) ?? [];
      const phoneDigits = normalizePhoneSearch(phoneNumber);

      const option: AutoCompleteOption = {
        value: phoneNumber,
        label,
        keywords: [
          toSearchableText(item.fullName),
          ...fullNameTokens,
          toSearchableText(item.phoneNumber),
          toSearchableText(item.province),
          toSearchableText(item.commune),
          toSearchableText(item.status),
          phoneNumber.toLowerCase(),
          phoneDigits,
        ].filter(Boolean),
      };

      return [option];
    });
  }, [referrersQuery.data?.content]);

  const provinceOptions = useMemo<AutoCompleteOption[]>(() => {
    return (provincesQuery.data?.content ?? []).map((item) => ({
      value: item.name,
      label: item.name,
      keywords: [toSearchableText(item.name), toSearchableText(item.fullName)],
    }));
  }, [provincesQuery.data?.content]);

  const wardOptions = useMemo<AutoCompleteOption[]>(() => {
    return (wardsQuery.data?.content ?? []).map((item) => ({
      value: item.name,
      label: item.name,
      keywords: [toSearchableText(item.name), toSearchableText(item.fullName)],
    }));
  }, [wardsQuery.data?.content]);

  const selectedRoles = watch("roles");
  const busy = submitting || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="grid gap-5"
    >
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" required>
              Họ và tên
            </Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              aria-invalid={Boolean(errors.fullName)}
              {...register("fullName")}
            />
            {fieldErrorMessage(errors.fullName) ? (
              <p className="text-xs text-rose-600">
                {errors.fullName?.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {fieldErrorMessage(errors.email) ? (
              <p className="text-xs text-rose-600">{errors.email?.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" required>
              Số điện thoại
            </Label>
            <Input
              id="phoneNumber"
              placeholder="0885 665 919"
              aria-invalid={Boolean(errors.phoneNumber)}
              disabled={mode === "edit"}
              {...register("phoneNumber")}
            />
            {fieldErrorMessage(errors.phoneNumber) ? (
              <p className="text-xs text-rose-600">
                {errors.phoneNumber?.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthYear" required>
              Năm sinh
            </Label>
            <Input
              id="birthYear"
              inputMode="numeric"
              placeholder="1995"
              aria-invalid={Boolean(errors.birthYear)}
              {...register("birthYear")}
            />
            {fieldErrorMessage(errors.birthYear) ? (
              <p className="text-xs text-rose-600">
                {errors.birthYear?.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="operatingArea" required>
              Khu vực hoạt động
            </Label>
            <Input
              id="operatingArea"
              placeholder="TP. Hồ Chí Minh"
              aria-invalid={Boolean(errors.operatingArea)}
              {...register("operatingArea")}
            />
            {fieldErrorMessage(errors.operatingArea) ? (
              <p className="text-xs text-rose-600">
                {errors.operatingArea?.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Tỉnh/Thành phố</Label>
            <Controller
              control={control}
              name="province"
              render={({ field }) => (
                <AutoCompleteSelect
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    if (val !== selectedProvinceName) {
                      const currentValues = watch();
                      reset({ ...currentValues, province: val, commune: "" });
                    }
                  }}
                  options={provinceOptions}
                  placeholder="Chọn Tỉnh/Thành phố"
                  searchPlaceholder="Tìm tỉnh/thành phố..."
                  emptyText="Không tìm thấy Tỉnh/Thành phố"
                  clearable
                  autocomplete
                  disabled={provincesQuery.isPending || busy}
                />
              )}
            />
            {fieldErrorMessage(errors.province) ? (
              <p className="text-xs text-rose-600">
                {errors.province?.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="commune">Phường/Xã</Label>
            <Controller
              control={control}
              name="commune"
              render={({ field }) => (
                <AutoCompleteSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={wardOptions}
                  placeholder="Chọn Phường/Xã"
                  searchPlaceholder="Tìm phường/xã..."
                  emptyText="Không tìm thấy Phường/Xã"
                  clearable
                  autocomplete
                  disabled={
                    !selectedProvinceCode || wardsQuery.isPending || busy
                  }
                />
              )}
            />
            {fieldErrorMessage(errors.commune) ? (
              <p className="text-xs text-rose-600">{errors.commune?.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="audienceType" required>
              Loại đối tượng
            </Label>
            <Controller
              control={control}
              name="audienceType"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(value as AdminUserAudienceType)
                  }
                >
                  <SelectTrigger id="audienceType">
                    <SelectValue placeholder="Chọn loại đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceTypeOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {fieldErrorMessage(errors.audienceType) ? (
              <p className="text-xs text-rose-600">
                {errors.audienceType?.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referrerPhoneNumber">
              Số điện thoại người giới thiệu
            </Label>
            <Controller
              control={control}
              name="referrerPhoneNumber"
              render={({ field }) => (
                <AutoCompleteSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={referrerPhoneOptions}
                  placeholder="Chọn số điện thoại người giới thiệu"
                  searchPlaceholder="Tìm theo tên hoặc số điện thoại..."
                  emptyText="Không tìm thấy số điện thoại"
                  clearable
                  autocomplete
                  disabled={
                    mode === "edit" ||
                    referrersQuery.isPending ||
                    referrersQuery.isFetching
                  }
                />
              )}
            />
            {fieldErrorMessage(errors.referrerPhoneNumber) ? (
              <p className="text-xs text-rose-600">
                {errors.referrerPhoneNumber?.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label required>Vai trò</Label>
          <Controller
            control={control}
            name="roles"
            render={({ field }) => (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {[
                  "Hệ thống",
                  "Trung tâm học tập MEVI",
                  "Trang trại MEVI",
                  "Mạng lưới nhà máy/cơ sở chế biến MEVI",
                  "Trạm xanh MEVI",
                ].map((group) => {
                  const groupRoles = selectableRoleOptions.filter(
                    (item) => item.group === group,
                  );

                  return (
                    <div key={group} className="space-y-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {group}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {groupRoles.map((role) => {
                          const checked = field.value.includes(role.code);

                          return (
                            <label
                              key={role.code}
                              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-slate-300"
                            >
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 disabled:opacity-50"
                                checked={checked}
                                disabled={mode === "edit"}
                                onChange={(event) => {
                                  const next = event.target.checked
                                    ? Array.from(
                                        new Set([...field.value, role.code]),
                                      )
                                    : field.value.filter(
                                        (item) => item !== role.code,
                                      );
                                  field.onChange(next);
                                }}
                              />
                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-slate-900">
                                  {role.label}
                                </span>
                                <span className="block text-xs text-slate-500">
                                  {role.code}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          />
          {fieldErrorMessage(errors.roles) ? (
            <p className="text-xs text-rose-600">{errors.roles?.message}</p>
          ) : null}
          {selectedRoles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedRoles.map((role) => {
                const matched = allRoleOptions.find(
                  (item) => item.code === role,
                );
                return (
                  <span
                    key={role}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {matched?.label ?? role}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={busy}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
