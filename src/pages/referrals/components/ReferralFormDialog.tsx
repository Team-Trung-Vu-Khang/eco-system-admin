import {
  AutoCompleteSelect,
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  referralStatusOptions,
  type ReferralFormErrors,
  type ReferralFormValues,
  type ReferralRow,
  type ReferralStatus,
} from "../data/referrals";

type ReferralFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedReferral: ReferralRow | null;
  formValues: ReferralFormValues;
  formErrors: ReferralFormErrors;
  loading: boolean;
  provinceOptions: { label: string; value: string }[];
  onSubmit: () => void;
  onFieldChange: <K extends keyof ReferralFormValues>(
    key: K,
    value: ReferralFormValues[K],
  ) => void;
}

export function ReferralFormDialog({
  open,
  onOpenChange,
  selectedReferral,
  formValues,
  formErrors,
  loading,
  provinceOptions,
  onSubmit,
  onFieldChange,
}: ReferralFormDialogProps) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        selectedReferral
          ? "Sửa thông tin người giới thiệu"
          : "Tạo thông tin người giới thiệu"
      }
      description={
        selectedReferral
          ? `Bản ghi gốc đang được đối chiếu theo số điện thoại cũ: ${selectedReferral.phone}.`
          : "Nhập số điện thoại, tên và tỉnh. Số điện thoại sẽ được tự động chuẩn hóa về đầu 84."
      }
      onSubmit={onSubmit}
      submitLabel={selectedReferral ? "Lưu thay đổi" : "Tạo thông tin"}
      loading={loading}
      size="lg"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="referral-phone" required>
            Số điện thoại
          </Label>
          <Input
            id="referral-phone"
            value={formValues.phone}
            onChange={(event) => onFieldChange("phone", event.target.value)}
            placeholder="0901 234 567"
            aria-invalid={Boolean(formErrors.phone)}
          />
          {formErrors.phone ? (
            <p className="text-sm text-rose-600">{formErrors.phone}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="referral-name" required>
            Tên
          </Label>
          <Input
            id="referral-name"
            value={formValues.fullName}
            onChange={(event) => onFieldChange("fullName", event.target.value)}
            placeholder="Nhập người giới thiệu"
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
            onChange={(value) => onFieldChange("province", value)}
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
              onFieldChange("status", value as ReferralStatus)
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
    </FormDialog>
  );
}
