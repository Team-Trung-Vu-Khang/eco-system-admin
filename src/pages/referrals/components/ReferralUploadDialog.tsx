import { useRef } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReferralUploadReview } from "../data/referrals";

type ReferralUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadText: string;
  uploadFileName: string;
  uploadReview: ReferralUploadReview;
  uploadResult: ReferralUploadReview | null;
  uploadLoading: boolean;
  onUploadTextChange: (value: string) => void;
  onFileLoaded: (text: string, fileName: string) => void;
  onDownloadTemplate: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function ReferralUploadDialog({
  open,
  onOpenChange,
  uploadText,
  uploadFileName,
  uploadReview,
  uploadResult,
  uploadLoading,
  onUploadTextChange,
  onFileLoaded,
  onDownloadTemplate,
  onSubmit,
  onReset,
}: ReferralUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rows = uploadResult?.rows ?? uploadReview.rows;
  const currentSummary = uploadResult ?? uploadReview;

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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Tải lên người giới thiệu</DialogTitle>
          <DialogDescription>
            Tải lên file dữ liệu hoặc dán nội dung theo mẫu. Số điện thoại sẽ
            được chuẩn hóa về đầu <code>84</code> và hệ thống sẽ kiểm tra
            trước khi lưu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
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

              <Button variant="outline" type="button" onClick={onDownloadTemplate}>
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

          <div className="space-y-2">
            <Label htmlFor="referral-upload-text">Dán dữ liệu</Label>
            <Textarea
              id="referral-upload-text"
              value={uploadText}
              onChange={(event) => onUploadTextChange(event.target.value)}
              placeholder="Mỗi dòng: số điện thoại, tên, tỉnh"
              className="min-h-40"
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">
                Kiểm tra trước khi tải lên
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">Hợp lệ: {currentSummary.successCount}</Badge>
                <Badge variant="destructive">Lỗi: {currentSummary.failCount}</Badge>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Dòng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Số điện thoại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Tên
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Tỉnh
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Kết quả
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Lý do
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.length > 0 ? (
                    rows.map((row) => (
                      <tr key={`${row.lineNumber}-${row.phone}-${row.fullName}`}>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {row.lineNumber}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-900">
                          {row.phone || "Không có"}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-900">
                          {row.fullName || "Không có"}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-900">
                          {row.province || "Không có"}
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={row.action === "Lỗi" ? "destructive" : "secondary"}
                          >
                            {row.action}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {row.reasons.length > 0
                            ? row.reasons.join(", ")
                            : row.action === "Cập nhật"
                              ? "Sẽ cập nhật bản ghi có số điện thoại này"
                              : "Hợp lệ"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-sm text-slate-500"
                      >
                        Chưa có dữ liệu để kiểm tra.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
          <Button onClick={onSubmit} disabled={uploadLoading || currentSummary.successCount === 0}>
            Tải lên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
