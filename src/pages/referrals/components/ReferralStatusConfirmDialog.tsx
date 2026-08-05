import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReferralRow } from "../data/referrals";

type ReferralStatusConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referral: ReferralRow | null;
  loading: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ReferralStatusConfirmDialog({
  open,
  onOpenChange,
  referral,
  loading,
  onConfirm,
}: ReferralStatusConfirmDialogProps) {
  const isActive = referral?.status === "Hoạt động";
  const nextStatusLabel = isActive ? "Không hoạt động" : "Hoạt động";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{nextStatusLabel} người giới thiệu</AlertDialogTitle>
          <AlertDialogDescription>
            {referral ? (
              <>
                Bạn có chắc muốn chuyển trạng thái người giới thiệu{" "}
                <strong>{referral.fullName}</strong> với số điện thoại{" "}
                <strong>{referral.phone}</strong> sang{" "}
                <strong>{nextStatusLabel}</strong> không?
              </>
            ) : (
              "Bạn có chắc muốn thay đổi trạng thái người giới thiệu này không?"
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            loading={loading}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
