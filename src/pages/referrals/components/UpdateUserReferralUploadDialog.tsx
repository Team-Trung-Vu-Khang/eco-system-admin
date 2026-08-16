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
  Progress,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2 } from "lucide-react";
import type {
  BulkUploadReferredJobResponse,
  BulkUploadReferredJobRow,
} from "@/api/update-user-referrer/update-user-referrer.response";
import {
  formatBulkUploadRowDescription,
  OUTCOME_LABELS,
  parseUpdateReferralUploadFile,
  type UpdateUserReferralUploadReview,
} from "../data/update-user-referral";

type UpdateUserReferralUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadFileName: string;
  uploadReview: UpdateUserReferralUploadReview;
  uploadJob: BulkUploadReferredJobResponse | null;
  uploadLoading: boolean;
  onFileLoaded: (text: string, fileName: string, file: File) => void;
  onDownloadTemplate: () => void;
  onSubmit: () => void;
  onReset: () => void;
  /** Phân trang bảng kết quả server-side */
  resultPage: number;
  resultSize: number;
  onResultPageChange: (page: number) => void;
  onResultSizeChange: (size: number) => void;
};

export function UpdateUserReferralUploadDialog({
  open,
  onOpenChange,
  uploadFileName,
  uploadReview,
  uploadJob,
  uploadLoading,
  onFileLoaded,
  onDownloadTemplate,
  onSubmit,
  onReset,
  resultPage,
  resultSize,
  onResultPageChange,
  onResultSizeChange,
}: UpdateUserReferralUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Upload result data ---
  const uploadResultCounts = uploadJob?.result
    ? {
        created: uploadJob.result.created ?? 0,
        overwritten: uploadJob.result.overwritten ?? 0,
        unchanged: uploadJob.result.unchanged ?? 0,
        failed: uploadJob.result.failed ?? 0,
      }
    : null;

  // --- Progress ---
  const uploadProgress = uploadJob?.progress ?? null;
  const processedRows = uploadProgress?.processedRows ?? 0;
  const totalRows = uploadProgress?.totalRows ?? 0;
  const progressValue =
    totalRows > 0
      ? Math.min(100, Math.round((processedRows / totalRows) * 100))
      : uploadJob?.result
        ? 100
        : 0;
  const progressLabel = uploadJob?.result
    ? "Hoàn tất"
    : uploadProgress
      ? `${processedRows}/${totalRows}`
      : "Đang chờ cập nhật";

  // --- Job status label ---
  const jobStatusLabel = (() => {
    const status = uploadJob?.status?.toUpperCase() ?? "";

    switch (status) {
      case "STARTED":
        return "Đang xử lý";
      case "COMPLETED":
        return "Hoàn tất";
      case "FAILED":
        return "Thất bại";
      case "CANCELLED":
      case "CANCELED":
        return "Đã huỷ";
      default:
        return uploadJob?.status ?? "Không rõ";
    }
  })();

  // --- Client-side review columns (pre-submit) ---
  const reviewColumns: Column<
    UpdateUserReferralUploadReview["rows"][number]
  >[] = [
    { key: "lineNumber", label: "Dòng", width: "80px" },
    {
      key: "referrerPhone",
      label: "SĐT người giới thiệu",
      width: "200px",
    },
    { key: "studentPhone", label: "SĐT người được giới thiệu", width: "180px" },
    // {
    //   key: "action",
    //   label: "Kết quả",
    //   width: "130px",
    //   render: (value, row) => (
    //     <Badge variant={String(value) === "Lỗi" ? "destructive" : "secondary"}>
    //       {row.action}
    //     </Badge>
    //   ),
    // },
    {
      key: "reasons",
      label: "Ghi chú",
      width: "320px",
      render: (value, row) => {
        const reasons = Array.isArray(value) ? value : row.reasons;

        return (
          <div className="whitespace-normal break-words text-sm leading-6 text-slate-600">
            {reasons.length > 0
              ? reasons.join(", ")
              : row.action === "Cập nhật"
                ? "Hợp lệ — SĐT chưa có sẽ tự tạo mới"
                : "Hợp lệ"}
          </div>
        );
      },
    },
  ];

  // --- Server-side result columns (post-submit) ---
  const serverResultRows = uploadJob?.result?.rows;
  const resultColumns: Column<BulkUploadReferredJobRow>[] = [
    { key: "rowNumber", label: "Dòng", width: "80px" },
    {
      key: "referrerPhoneNumber",
      label: "SĐT người giới thiệu",
      width: "200px",
    },
    {
      key: "referrerFullName",
      label: "Tên người giới thiệu",
      width: "180px",
      render: (value) => (
        <span className="text-sm text-slate-700">
          {(value as string | null) ?? "—"}
        </span>
      ),
    },
    {
      key: "referredPhoneNumber",
      label: "SĐT người được giới thiệu",
      width: "180px",
    },
    {
      key: "referredFullName",
      label: "Tên người được giới thiệu",
      width: "180px",
      render: (value) => (
        <span className="text-sm text-slate-700">
          {(value as string | null) ?? "—"}
        </span>
      ),
    },
    {
      key: "success",
      label: "Kết quả",
      width: "130px",
      render: (_value, row) => {
        if (!row.success) {
          return <Badge variant="destructive">Lỗi</Badge>;
        }
        const label = OUTCOME_LABELS[row.outcome ?? ""] ?? "Thành công";
        return <Badge variant="secondary">{label}</Badge>;
      },
    },
    {
      key: "outcome",
      label: "Chi tiết",
      width: "360px",
      render: (_value, row) => (
        <div className="whitespace-normal break-words text-sm leading-6 text-slate-600">
          {formatBulkUploadRowDescription(row)}
        </div>
      ),
    },
  ];

  const isCompleted = uploadJob?.status?.toUpperCase() === "COMPLETED";

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
          <DialogTitle>Cập nhật người giới thiệu cho học viên</DialogTitle>
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
                    Tải file mẫu để nhập đúng 2 cột: số điện thoại người giới
                    thiệu, số điện thoại học viên.
                  </li>
                  <li>Số điện thoại sẽ tự động quy về đầu 84.</li>
                  <li>
                    SĐT học viên chưa có trong hệ thống sẽ được tự động tạo mới
                    (không phải lỗi).
                  </li>
                  <li>
                    Hệ thống sẽ kiểm tra trước khi tải lên và báo rõ dòng lỗi.
                  </li>
                </ul>
              </div>

              <Button
                type="button"
                variant="outline"
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
              accept=".xlsx,.xls,.csv,.txt"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                const text = await parseUpdateReferralUploadFile(file);
                onFileLoaded(text, file.name, file);
              }}
            />
          </div>

          {/* Client-side review table (pre-submit) */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">
                Kiểm tra trước khi tải lên
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">
                  Hợp lệ: {uploadReview.successCount}
                </Badge>
                <Badge variant="destructive">
                  Lỗi: {uploadReview.failCount}
                </Badge>
              </div>
            </div>

            {uploadReview.rows.length > 0 ? (
              <div className="w-full min-w-0 overflow-x-auto">
                <DataTable
                  columns={reviewColumns}
                  data={uploadReview.rows}
                  searchable={false}
                  selectable={false}
                  loading={false}
                  pageSize={Math.max(1, uploadReview.rows.length)}
                  currentIndex={0}
                  totalElements={uploadReview.rows.length}
                  totalPages={1}
                  onPageSize={() => undefined}
                  onIndexChange={() => undefined}
                />
              </div>
            ) : uploadReview.errorMessage ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
                {uploadReview.errorMessage}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                Chưa có dữ liệu để kiểm tra.
              </div>
            )}
          </div>

          {/* Upload job status */}
          {uploadJob ? (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">Trạng thái tải lên</p>
                <Badge variant="secondary">{jobStatusLabel}</Badge>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                    Kết quả
                  </div>
                  <div className="mt-1 text-sm">
                    {uploadResultCounts
                      ? [
                          `Tạo mới: ${uploadResultCounts.created}`,
                          `Ghi đè: ${uploadResultCounts.overwritten}`,
                          `Không đổi: ${uploadResultCounts.unchanged}`,
                          `Lỗi: ${uploadResultCounts.failed}`,
                        ].join(" · ")
                      : "Đang xử lý..."}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                    Tiến độ
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{progressLabel}</span>
                      <span className="font-medium">
                        {uploadJob.result ? "100%" : `${progressValue}%`}
                      </span>
                    </div>
                    <Progress
                      value={progressValue}
                      className="h-2 rounded-full bg-sky-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Server-side result table (post-submit, paginated) */}
          {isCompleted && serverResultRows ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                Chi tiết kết quả xử lý
              </p>
              <div className="w-full min-w-0 overflow-x-auto">
                <DataTable
                  columns={resultColumns}
                  data={serverResultRows.content}
                  searchable={false}
                  selectable={false}
                  loading={false}
                  pageSize={resultSize}
                  currentIndex={resultPage + 1}
                  totalElements={serverResultRows.totalElements}
                  totalPages={serverResultRows.totalPages}
                  onPageSize={onResultSizeChange}
                  onIndexChange={(idx) =>
                    onResultPageChange(Math.max(0, idx - 1))
                  }
                />
              </div>
            </div>
          ) : null}
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
            disabled={uploadLoading || uploadReview.successCount === 0}
          >
            {uploadLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {uploadLoading ? "Đang tải lên..." : "Tải lên"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
