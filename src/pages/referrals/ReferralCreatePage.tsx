import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import {
  Button,
  AutoCompleteSelect,
  Input,
  Label,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCreateReferrerMutation } from "@/api/referrers/referrers.hooks";
import { useProvincesQuery } from "@/api/provinces/provinces.hooks";
import { useWardsQuery } from "@/api/wards/wards.hooks";
import {
  normalizePhoneTo84,
  vietnamMobilePhoneRegex,
} from "./data/referrals";
import { getApiErrorDescription } from "@/lib/api-error";

const referralCreateSchema = z.object({
  fullName: z.string().trim().min(1, "Vui lòng nhập tên"),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(vietnamMobilePhoneRegex, {
      message: "Số điện thoại không hợp lệ",
    }),
  province: z.string().trim().min(1, "Vui lòng chọn nhập tỉnh"),
  commune: z.string().trim().min(1, "Vui lòng nhập xã/phường"),
});

type ReferralCreateFormValues = z.infer<typeof referralCreateSchema>;

const defaultValues: ReferralCreateFormValues = {
  fullName: "",
  phone: "",
  province: "",
  commune: "",
};

export function ReferralCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const provincesQuery = useProvincesQuery({
    status: "active",
    page: 0,
    size: 100,
  });
  const createReferrerMutation = useCreateReferrerMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ReferralCreateFormValues>({
    resolver: zodResolver(referralCreateSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const selectedProvince = watch("province");

  const provinceOptions = useMemo(() => {
    return (
      provincesQuery.data?.content?.map((province) => ({
        label: province.fullName,
        value: province.fullName,
      })) ?? []
    );
  }, [provincesQuery.data?.content]);

  const selectedProvinceCode = useMemo(() => {
    return (
      provincesQuery.data?.content?.find(
        (province) => province.fullName === selectedProvince,
      )?.code ?? ""
    );
  }, [provincesQuery.data?.content, selectedProvince]);

  const wardsQuery = useWardsQuery({
    provinceCode: selectedProvinceCode,
    page: 0,
    size: 100,
  });

  const communeOptions = useMemo(() => {
    return (
      wardsQuery.data?.content?.map((ward) => ({
        label: ward.fullName,
        value: ward.fullName,
      })) ?? []
    );
  }, [wardsQuery.data?.content]);

  useEffect(() => {
    setValue("commune", "");
  }, [selectedProvinceCode, setValue]);

  const onSubmit = async (values: ReferralCreateFormValues) => {
    const normalizedPhone = normalizePhoneTo84(values.phone);

    createReferrerMutation.mutate(
      {
        phoneNumber: normalizedPhone,
        fullName: values.fullName,
        province: values.province,
        commune: values.commune,
      },
      {
        onSuccess: () => {
          toast({
            title: "Tạo người giới thiệu thành công",
            duration: 2000,
          });
          setLocation("/referrals");
        },
        onError: (error) => {
          console.error(error);

          toast({
            title: "Không thể tạo người giới thiệu",
            description: getApiErrorDescription(
              error,
              "Vui lòng kiểm tra lại thông tin và thử lại.",
            ),
            variant: "destructive",
            duration: 2000,
          });
        },
      },
    );
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
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 sm:text-3xl md:text-4xl">
              Tạo người giới thiệu
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Nhập số điện thoại, tên, tỉnh và xã/phường. Số điện thoại sẽ tự
              động chuẩn hóa về đầu 84.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => setLocation("/referrals")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="referral-name" required>
              Họ và tên
            </Label>
            <Controller
              control={control}
              name="fullName"
              render={({ field }) => (
                <Input
                  id="referral-name"
                  {...field}
                  placeholder="Nhập người giới thiệu"
                  aria-invalid={Boolean(errors.fullName)}
                />
              )}
            />
            {errors.fullName ? (
              <p className="text-sm text-rose-600">{errors.fullName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral-phone" required>
              Số điện thoại
            </Label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  id="referral-phone"
                  {...field}
                  placeholder="0901 234 567"
                  aria-invalid={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone ? (
              <p className="text-sm text-rose-600">{errors.phone.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="referral-province" required>
              Tỉnh
            </Label>
            <Controller
              control={control}
              name="province"
              render={({ field }) => (
                <AutoCompleteSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={provinceOptions}
                  placeholder="Chọn tỉnh"
                  searchPlaceholder="Tìm theo tỉnh..."
                  emptyText="Không tìm thấy tỉnh"
                  clearable
                  autocomplete
                />
              )}
            />
            {errors.province ? (
              <p className="text-sm text-rose-600">{errors.province.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="referral-commune" required>
              Xã/phường
            </Label>
            <Controller
              control={control}
              name="commune"
              render={({ field }) => (
                <AutoCompleteSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={communeOptions}
                  placeholder={
                    selectedProvinceCode ? "Chọn xã/phường" : "Chọn tỉnh trước"
                  }
                  searchPlaceholder="Tìm theo xã/phường..."
                  emptyText="Không tìm thấy xã/phường"
                  clearable
                  autocomplete
                  disabled={!selectedProvinceCode}
                />
              )}
            />
            {errors.commune ? (
              <p className="text-sm text-rose-600">{errors.commune.message}</p>
            ) : null}
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
          <Button
            type="submit"
            disabled={
              !isDirty || createReferrerMutation.isPending || isSubmitting
            }
          >
            {createReferrerMutation.isPending || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo thông tin"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
