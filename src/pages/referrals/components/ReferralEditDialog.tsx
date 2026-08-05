import { useEffect, useState } from "react";
import { FormDialog, Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReferralRow } from "../data/referrals";

type ReferralEditFormValues = {
  phone: string;
  fullName: string;
  province: string;
  commune: string;
};

type ReferralEditFormErrors = Partial<
  Record<keyof ReferralEditFormValues, string>
>;

type ReferralEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referral: ReferralRow | null;
  loading: boolean;
  onSubmit: (
    values: Omit<ReferralEditFormValues, "phone">,
  ) => void | Promise<void>;
};

function buildInitialValues(
  referral: ReferralRow | null,
): ReferralEditFormValues {
  return {
    phone: referral?.phone ?? "",
    fullName: referral?.fullName ?? "",
    province: referral?.province ?? "",
    commune: referral?.commune ?? "",
  };
}

function validate(values: ReferralEditFormValues) {
  const errors: ReferralEditFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập tên";
  }

  if (!values.province.trim()) {
    errors.province = "Vui lòng chọn tỉnh";
  }

  if (!values.commune.trim()) {
    errors.commune = "Vui lòng nhập xã/phường";
  }

  return errors;
}

export function ReferralEditDialog({
  open,
  onOpenChange,
  referral,
  loading,
  onSubmit,
}: ReferralEditDialogProps) {
  const [formValues, setFormValues] = useState<ReferralEditFormValues>(() =>
    buildInitialValues(referral),
  );
  const [formErrors, setFormErrors] = useState<ReferralEditFormErrors>({});

  useEffect(() => {
    if (open) {
      setFormValues(buildInitialValues(referral));
      setFormErrors({});
    }
  }, [open, referral]);

  const title = referral
    ? "Sửa thông tin người giới thiệu"
    : "Cập nhật người giới thiệu";

  const description = referral
    ? "Số điện thoại được khóa để tránh thay đổi ngoài ý muốn. Chỉ cập nhật thông tin còn lại."
    : "Chọn một bản ghi để chỉnh sửa.";

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      submitLabel="Lưu thay đổi"
      loading={loading}
      onSubmit={async () => {
        const nextErrors = validate(formValues);
        setFormErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
          return;
        }

        await onSubmit({
          fullName: formValues.fullName.trim(),
          province: formValues.province.trim(),
          commune: formValues.commune.trim(),
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="referral-phone" required>
            Số điện thoại
          </Label>
          <Input
            id="referral-phone"
            value={formValues.phone}
            disabled
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="referral-name" required>
            Họ và tên
          </Label>
          <Input
            id="referral-name"
            value={formValues.fullName}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                fullName: event.target.value,
              }))
            }
            placeholder="Nhập họ và tên"
            aria-invalid={Boolean(formErrors.fullName)}
          />
          {formErrors.fullName ? (
            <p className="text-sm text-rose-600">{formErrors.fullName}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="referral-province" required>
            Tỉnh
          </Label>
          <Input
            id="referral-province"
            value={formValues.province}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                province: event.target.value,
              }))
            }
            placeholder="Nhập tỉnh"
            aria-invalid={Boolean(formErrors.province)}
          />
          {formErrors.province ? (
            <p className="text-sm text-rose-600">{formErrors.province}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="referral-commune" required>
            Xã/phường
          </Label>
          <Input
            id="referral-commune"
            value={formValues.commune}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                commune: event.target.value,
              }))
            }
            placeholder="Nhập xã/phường"
            aria-invalid={Boolean(formErrors.commune)}
          />
          {formErrors.commune ? (
            <p className="text-sm text-rose-600">{formErrors.commune}</p>
          ) : null}
        </div>
      </div>
    </FormDialog>
  );
}
