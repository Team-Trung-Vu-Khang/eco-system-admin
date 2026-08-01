import { useRef, useState } from "react";
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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  buildUserImportTemplate,
  reviewUserUploadText,
  type UserImportReview,
  type UserImportValues,
  userImportColumns,
} from "../data/import";

type ImportUsersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingEmails: string[];
  onImport: (rows: UserImportValues[]) => void;
};

export function ImportUsersDialog({
  open,
  onOpenChange,
  existingEmails,
  onImport,
}: ImportUsersDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [review, setReview] = useState<UserImportReview>({
    rows: [],
    validValues: [],
    successCount: 0,
    failCount: 0,
  });
  const [uploading, setUploading] = useState(false);

  const refreshReview = (text: string) => {
    setReview(reviewUserUploadText(text, existingEmails));
  };

  const rows = review.rows;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          setFileName("");
          setReview({
            rows: [],
            validValues: [],
            successCount: 0,
            failCount: 0,
          });
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }}
    >
      <DialogContent className="w-[min(96vw,72rem)] max-w-[96vw] sm:max-w-none max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
            Nhập người dùng
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-slate-500">
            Đây là khung nhập dữ liệu mẫu. Bạn có thể dùng file theo đúng định
            dạng để hệ thống kiểm tra trước khi lưu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pb-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">
                  Hướng dẫn nhập người dùng
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                  <li>
                    File gồm 6 cột: họ và tên, email, số điện thoại, người
                    giới thiệu, vai trò, trạng thái.
                  </li>
                  <li>Số điện thoại sẽ tự động quy về đầu 84.</li>
                  <li>
                    Hệ thống sẽ kiểm tra trước khi nhập và báo rõ từng dòng
                    lỗi.
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  const blob = new Blob([buildUserImportTemplate()], {
                    type: "text/csv;charset=utf-8;",
                  });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "mau-nhap-nguoi-dung.csv";
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(url);
                }}
              >
                Tải mẫu
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
                {fileName || "Chưa có tệp nào được chọn"}
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
                setFileName(file.name);
                refreshReview(text);
              }}
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">
                Kiểm tra trước khi nhập
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">Hợp lệ: {review.successCount}</Badge>
                <Badge variant="destructive">Lỗi: {review.failCount}</Badge>
              </div>
            </div>

            {rows.length > 0 ? (
              <div className="w-full min-w-0 overflow-x-auto">
                <DataTable
                  columns={userImportColumns}
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
              setFileName("");
              setReview({
                rows: [],
                validValues: [],
                successCount: 0,
                failCount: 0,
              });
              onOpenChange(false);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              setUploading(true);
              try {
                onImport(review.validValues);
                setFileName("");
                setReview({
                  rows: [],
                  validValues: [],
                  successCount: 0,
                  failCount: 0,
                });
                onOpenChange(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
              } finally {
                setUploading(false);
              }
            }}
            disabled={uploading || review.successCount === 0}
          >
            Nhập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
