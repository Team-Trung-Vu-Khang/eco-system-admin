import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  buildReferralFormValues,
  useReferralsStore,
} from "./hooks/useReferralsStore";
import { getUsersLinkedToReferral } from "../users/hooks/useUsers";
import {
  initialReferralFormValues,
  normalizePhoneTo84,
  reviewReferralUploadText,
  type ReferralFormErrors,
  type ReferralFormValues,
  type ReferralRow,
  type ReferralUploadReview,
} from "./data/referrals";
import { ReferralDetailDialog } from "./components/ReferralDetailDialog";
import { ReferralFormDialog } from "./components/ReferralFormDialog";
import { ReferralListTable } from "./components/ReferralListTable";
import { ReferralPageHeader } from "./components/ReferralPageHeader";
import { ReferralUploadDialog } from "./components/ReferralUploadDialog";

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
  const [, setLocation] = useLocation();
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
  const [uploadResult, setUploadResult] = useState<ReferralUploadReview | null>(
    null,
  );
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

  const uploadReview = useMemo(
    () =>
      reviewReferralUploadText(
        uploadText,
        referrals.map((item) => item.phone),
      ),
    [referrals, uploadText],
  );

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
      if (uploadReview.validValues.length > 0) {
        upsertManyReferrals(uploadReview.validValues);
      }
      setUploadResult(uploadReview);
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

  const downloadReferralTemplate = () => {
    const template = [
      "Số điện thoại,Tên,Tỉnh",
      "0901234567,Nguyễn Văn A,TP. Hồ Chí Minh",
      "0902123456,Trần Thị B,Hà Nội",
    ].join("\n");

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mau-nguoi-gioi-thieu.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const resetUploadDialog = () => {
    setUploadText("");
    setUploadFileName("");
    setUploadResult(null);
  };

  const onUploadFileLoaded = (text: string, fileName: string) => {
    setUploadText(text);
    setUploadFileName(fileName);
    setUploadResult(null);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <ReferralPageHeader
        onUploadClick={() => setUploadOpen(true)}
        onCreateClick={openCreate}
      />

      <ReferralListTable
        data={filteredReferrals}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response.totalElements}
        totalPages={response.totalPages}
        provinceOptions={provinceOptions}
        onSearch={handleSearch}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        onFilterChange={handleFilterChange}
        onView={openView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <ReferralFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setSelectedReferral(null);
            setFormErrors({});
            setFormValues(initialReferralFormValues);
          }
        }}
        selectedReferral={selectedReferral}
        formValues={formValues}
        formErrors={formErrors}
        loading={formLoading}
        provinceOptions={provinceOptions}
        onSubmit={submitForm}
        onFieldChange={updateField}
      />

      <ReferralUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        uploadFileName={uploadFileName}
        uploadReview={uploadReview}
        uploadResult={uploadResult}
        uploadLoading={uploadLoading}
        onFileLoaded={onUploadFileLoaded}
        onDownloadTemplate={downloadReferralTemplate}
        onSubmit={submitUpload}
        onReset={resetUploadDialog}
      />

      <ReferralDetailDialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            setDetailReferral(null);
            setDetailTab("info");
          }
        }}
        detailReferral={detailReferral}
        detailTab={detailTab}
        onTabChange={setDetailTab}
        linkedUsers={linkedUsers}
        onOpenUser={(userId) => setLocation(`/users/${userId}/edit`)}
      />

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
