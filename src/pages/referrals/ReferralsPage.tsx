import { useMemo, useRef, useState } from "react";
import { Upload, Plus, Users } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormDialog,
  Input,
  Label,
  Badge,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  buildReferralFormValues,
  useReferralsStore,
} from "./hooks/useReferralsStore";
import { getUsersLinkedToReferral } from "../users/hooks/useUsers";
import { type UserRow } from "../users/data/table";
import {
  initialReferralFormValues,
  normalizePhoneTo84,
  parseReferralUploadText,
  referralStatusOptions,
  type ReferralStatus,
  type ReferralFormValues,
  type ReferralRow,
} from "./data/referrals";
import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";

const referralColumns: Column<ReferralRow>[] = [
  { key: "phone", label: "Số điện thoại" },
  { key: "fullName", label: "Người giới thiệu", sortable: true },
  { key: "province", label: "Tỉnh" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const status = String(value);
      const variant = status === "Hoạt động" ? "secondary" : "destructive";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { key: "updatedAt", label: "Cập nhật gần nhất" },
];

type ReferralFormErrors = Partial<Record<keyof ReferralFormValues, string>>;

function validate(values: ReferralFormValues) {
  const errors: ReferralFormErrors = {};
  const normalizedPhone = normalizePhoneTo84(values.phone);

  if (!values.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
  else if (!normalizedPhone.startsWith("84")) {
    errors.phone = "Số điện thoại phải quy về đầu 84";
  }

  if (!values.fullName.trim()) errors.fullName = "Vui lòng nhập tên";
  if (!values.province.trim()) errors.province = "Vui lòng nhập tỉnh";
  if (!values.status.trim()) errors.status = "Vui lòng chọn trạng thái";

  return errors;
}

export function ReferralsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<"info" | "users">("info");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRow | null>(
    null,
  );
  const [detailReferral, setDetailReferral] = useState<ReferralRow | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<ReferralRow | null>(null);
  const [formValues, setFormValues] = useState<ReferralFormValues>(
    initialReferralFormValues,
  );
  const [formErrors, setFormErrors] = useState<ReferralFormErrors>({});
  const [uploadText, setUploadText] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const {
    referrals,
    createReferral,
    updateReferral,
    deleteReferral,
    upsertManyReferrals,
  } = useReferralsStore();

  const provinceOptions = useMemo(() => {
    const values = Array.from(
      new Set(referrals.map((item) => item.province)),
    ).sort();
    return [
      { label: "Tất cả", value: "" },
      ...values.map((value) => ({ label: value, value })),
    ];
  }, [referrals]);

  const filteredReferrals = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return referrals.filter((referral) => {
      const matchesSearch =
        !query ||
        [
          referral.phone,
          referral.fullName,
          referral.province,
          referral.status,
          referral.updatedAt,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesProvince =
        !activeFilters.province || referral.province === activeFilters.province;

      return matchesSearch && matchesProvince;
    });
  }, [activeFilters.province, referrals, searchTerm]);

  const response = useMemo(
    () => ({
      totalElements: filteredReferrals.length,
      totalPages: Math.max(1, Math.ceil(filteredReferrals.length / pageSize)),
    }),
    [filteredReferrals.length, pageSize],
  );

  const linkedUsers = useMemo(() => {
    if (!detailReferral) return [];

    return getUsersLinkedToReferral(detailReferral.fullName);
  }, [detailReferral]);

  const linkedUserColumns: Column<UserRow>[] = useMemo(
    () => [
      { key: "fullName", label: "Họ và tên", sortable: true, width: "180px" },
      { key: "phone", label: "Số điện thoại", width: "150px" },
      { key: "email", label: "Email", width: "240px" },
      { key: "role", label: "Vai trò", width: "140px" },
      {
        key: "status",
        label: "Trạng thái",
        width: "140px",
        render: (value) => {
          const status = String(value);
          const variant = status === "Hoạt động" ? "secondary" : "destructive";

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
    ],
    [],
  );

  const openCreate = () => {
    setSelectedReferral(null);
    setFormValues(initialReferralFormValues);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEdit = (referral: ReferralRow) => {
    setSelectedReferral(referral);
    setFormValues(buildReferralFormValues(referral));
    setFormErrors({});
    setFormOpen(true);
  };

  const openView = (referral: ReferralRow) => {
    setDetailReferral(referral);
    setDetailTab("info");
    setDetailOpen(true);
  };

  const openDelete = (referral: ReferralRow) => {
    setDeleteTarget(referral);
    setDeleteOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentIndex(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((current) => ({ ...current, [key]: value }));
    setCurrentIndex(0);
  };

  const updateField = <K extends keyof ReferralFormValues>(
    key: K,
    value: ReferralFormValues[K],
  ) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const submitForm = async () => {
    const nextErrors = validate(formValues);
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const normalizedPhone = normalizePhoneTo84(formValues.phone);
    const duplicate = referrals.find(
      (item) =>
        item.phone === normalizedPhone && item.id !== selectedReferral?.id,
    );
    if (duplicate) {
      setFormErrors({
        phone:
          "Số điện thoại này đã tồn tại. Hãy chỉnh sửa bản ghi cũ thay vì tạo mới.",
      });
      return;
    }

    setFormLoading(true);
    try {
      if (selectedReferral) {
        updateReferral(selectedReferral.id, {
          ...formValues,
          phone: normalizedPhone,
        });
      } else {
        createReferral({
          ...formValues,
          phone: normalizedPhone,
        });
      }

      setFormOpen(false);
      setSelectedReferral(null);
      setFormValues(initialReferralFormValues);
    } finally {
      setFormLoading(false);
    }
  };

  const submitUpload = async () => {
    setUploadLoading(true);
    try {
      const parsedRows = parseReferralUploadText(uploadText);
      upsertManyReferrals(parsedRows);
      setUploadOpen(false);
      setUploadText("");
      setUploadFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploadLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    deleteReferral(deleteTarget.id);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const readFile = async (file: File) => {
    const text = await file.text();
    setUploadText(text);
    setUploadFileName(file.name);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Quản lý người giới thiệu
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Danh sách tài khoản người giới thiệu. Có thể upload, tạo mới hoặc
              sửa thông tin theo số điện thoại, tên và tỉnh.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Nhập dữ liệu
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo thông tin
          </Button>
        </div>
      </div>

      <DataTable
        columns={referralColumns}
        data={filteredReferrals}
        searchable
        searchPlaceholder="Tìm kiếm theo số điện thoại, tên, tỉnh..."
        selectable={false}
        loading={false}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response.totalElements}
        totalPages={response.totalPages}
        onSearch={handleSearch}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        filters={[
          {
            key: "province",
            label: "Tỉnh",
            options: provinceOptions,
          },
        ]}
        onFilterChange={handleFilterChange}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setSelectedReferral(null);
            setFormErrors({});
            setFormValues(initialReferralFormValues);
          }
        }}
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
        onSubmit={submitForm}
        submitLabel={selectedReferral ? "Lưu thay đổi" : "Tạo thông tin"}
        loading={formLoading}
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
              onChange={(event) => updateField("phone", event.target.value)}
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
              onChange={(event) => updateField("fullName", event.target.value)}
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
            <Input
              id="referral-province"
              value={formValues.province}
              onChange={(event) => updateField("province", event.target.value)}
              placeholder="Ví dụ: Hà Nội"
              aria-invalid={Boolean(formErrors.province)}
            />
            {formErrors.province ? (
              <p className="text-sm text-rose-600">{formErrors.province}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="referral-status" required>
              Trạng thái
            </Label>
            <select
              id="referral-status"
              value={formValues.status}
              onChange={(event) =>
                updateField("status", event.target.value as ReferralStatus)
              }
              className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
            >
              {referralStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.status ? (
              <p className="text-sm text-rose-600">{formErrors.status}</p>
            ) : null}
          </div>
        </div>
      </FormDialog>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload người giới thiệu</DialogTitle>
            <DialogDescription>
              Tải lên file `.csv` hoặc dán dữ liệu theo format: số điện thoại,
              tên, tỉnh. Số điện thoại sẽ được chuẩn hóa về đầu <code>84</code>{" "}
              và update theo số cũ nếu trùng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referral-upload-file">File upload</Label>
              <Input
                id="referral-upload-file"
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    await readFile(file);
                  }
                }}
              />
              <p className="text-xs text-slate-500">
                Ví dụ: `0901234567,Nguyễn Văn A,Hà Nội`
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral-upload-text">Dữ liệu upload</Label>
              <Textarea
                id="referral-upload-text"
                value={uploadText}
                onChange={(event) => setUploadText(event.target.value)}
                placeholder="Mỗi dòng: số điện thoại, tên, tỉnh"
                className="min-h-40"
              />
              {uploadFileName ? (
                <p className="text-xs text-slate-500">
                  File đã chọn: {uploadFileName}
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={submitUpload}
              disabled={uploadLoading || !uploadText.trim()}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            setDetailReferral(null);
            setDetailTab("info");
          }
        }}
      >
        <DialogContent className="w-[calc(40vw-1rem)] max-w-[calc(40vw-1rem)] overflow-hidden border-0 bg-white p-0 shadow-none">
          {detailReferral ? (
            <div className="bg-white px-6 py-6">
              <DialogHeader className="space-y-4">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                    {detailReferral.fullName}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-6 text-slate-500">
                    Thông tin người giới thiệu được chuẩn hóa theo số điện thoại
                    đầu
                    <code>84</code>.
                  </DialogDescription>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      detailReferral.status === "Hoạt động"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {detailReferral.status}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    Cập nhật gần nhất: {detailReferral.updatedAt}
                  </span>
                </div>
              </DialogHeader>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDetailTab("info")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    detailTab === "info"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Thông tin
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab("users")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    detailTab === "users"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Danh sách người dùng
                </button>
              </div>

              {detailTab === "info" ? (
                <div className="mt-6 space-y-5">
                  <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Số điện thoại
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {detailReferral.phone}
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Tên
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {detailReferral.fullName}
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Tỉnh
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {detailReferral.province}
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Trạng thái
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {detailReferral.status}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  {linkedUsers.length > 0 ? (
                    <div className="w-full min-w-0 overflow-x-auto pb-2">
                      <DataTable
                        columns={linkedUserColumns}
                        data={linkedUsers}
                        selectable={false}
                        loading={false}
                        pageSize={Math.max(1, linkedUsers.length)}
                        currentIndex={0}
                        totalElements={linkedUsers.length}
                        totalPages={1}
                        onPageSize={() => undefined}
                        onIndexChange={() => undefined}
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
                      Chưa có người dùng nào được gắn với người giới thiệu này.
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Xóa người giới thiệu"
        description="Bạn có chắc chắn muốn xóa người giới thiệu này? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
      />
    </section>
  );
}
