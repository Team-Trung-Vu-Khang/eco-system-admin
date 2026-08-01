import { useRef } from "react";
import {
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReferralUploadReview } from "../data/referrals";

type ReferralUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadFileName: string;
  uploadReview: ReferralUploadReview;
  uploadResult: ReferralUploadReview | null;
  uploadLoading: boolean;
  onFileLoaded: (text: string, fileName: string) => void;
  onDownloadTemplate: () => void;
  onSubmit: () => void;
  onReset: () => void;
};

export function ReferralUploadDialog({
  open,
  onOpenChange,
  uploadFileName,
  uploadReview,
  uploadResult,
  uploadLoading,
  onFileLoaded,
  onDownloadTemplate,
  onSubmit,
  onReset,
}: ReferralUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rows = uploadResult?.rows ?? uploadReview.rows;
  const currentSummary = uploadResult ?? uploadReview;
  const reviewColumns: Column<ReferralUploadReview["rows"][number]>[] = [
    { key: "lineNumber", label: "Dòng", width: "80px" },
    { key: "phone", label: "Số điện thoại", width: "150px" },
    { key: "fullName", label: "Tên", width: "180px" },
    { key: "province", label: "Tỉnh", width: "180px" },
    {
      key: "action",
      label: "Kết quả",
      width: "130px",
      render: (value, row) => (
        <Badge variant={String(value) === "Lỗi" ? "destructive" : "secondary"}>
          {row.action}
        </Badge>
      ),
    },
    {
      key: "reasons",
      label: "Lý do",
      width: "320px",
      render: (value, row) => {
        const reasons = Array.isArray(value) ? value : row.reasons;

        return (
          <div className="whitespace-normal break-words text-sm leading-6 text-slate-600">
            {reasons.length > 0
              ? reasons.join(", ")
              : row.action === "Cập nhật"
                ? "Sẽ cập nhật bản ghi có số điện thoại này"
                : "Hợp lệ"}
          </div>
        );
      },
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          onReset();
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }}
    >
      <DialogContent className="w-[min(96vw,72rem)] max-w-[96vw] sm:max-w-none max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Tải lên người giới thiệu</DialogTitle>
          <DialogDescription>
            Tải lên file dữ liệu theo mẫu. Số điện thoại sẽ được chuẩn hóa về
            đầu <code>84</code> và hệ thống sẽ kiểm tra trước khi lưu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pb-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">
                  Mẫu nhập và hướng dẫn
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                  <li>
                    Tải file mẫu để nhập đúng 3 cột: số điện thoại, tên, tỉnh.
                  </li>
                  <li>Số điện thoại sẽ tự động quy về đầu 84.</li>
                  <li>
                    Hệ thống sẽ kiểm tra trước khi tải lên và báo rõ dòng lỗi.
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                type="button"
                onClick={onDownloadTemplate}
              >
                Tải file mẫu
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Chọn tệp</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                variant="outline"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Chọn tệp
              </Button>
              <span className="text-sm text-slate-500">
                {uploadFileName || "Chưa có tệp nào được chọn"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                const text = await file.text();
                onFileLoaded(text, file.name);
              }}
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">
                Kiểm tra trước khi tải lên
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">
                  Hợp lệ: {currentSummary.successCount}
                </Badge>
                <Badge variant="destructive">
                  Lỗi: {currentSummary.failCount}
                </Badge>
              </div>
            </div>

            {rows.length > 0 ? (
              <div className="w-full min-w-0 overflow-x-auto">
                <DataTable
                  columns={reviewColumns}
                  data={rows}
                  searchable={false}
                  selectable={false}
                  loading={false}
                  pageSize={Math.max(1, rows.length)}
                  currentIndex={0}
                  totalElements={rows.length}
                  totalPages={1}
                  onPageSize={() => undefined}
                  onIndexChange={() => undefined}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                Chưa có dữ liệu để kiểm tra.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onReset();
              onOpenChange(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            disabled={uploadLoading || currentSummary.successCount === 0}
          >
            Tải lên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
