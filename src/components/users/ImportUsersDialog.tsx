import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button } from '@Team-Trung-Vu-Khang/eco-shared-ui'

type ImportUsersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: () => void
}

export function ImportUsersDialog({
  open,
  onOpenChange,
  onImport,
}: ImportUsersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập người dùng</DialogTitle>
          <DialogDescription>
            Đây là khung nhập dữ liệu mẫu. Bạn có thể thay bằng import Excel sau.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="users-import-note">
            Ghi chú
          </label>
          <textarea
            id="users-import-note"
            className="min-h-28 w-full rounded-xl border border-black/10 bg-white p-3 text-sm outline-none"
            placeholder="Dán dữ liệu hoặc mô tả cách import ở đây..."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
