import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useReferralsStore } from "./hooks/useReferralsStore";
import {
  type ReferralRow,
  type ReferralUploadReview,
  reviewReferralUploadText,
} from "./data/referrals";
import { ReferralListTable } from "./components/ReferralListTable";
import { ReferralPageHeader } from "./components/ReferralPageHeader";
import { ReferralUploadDialog } from "./components/ReferralUploadDialog";

export function ReferralsPage() {
  const [, setLocation] = useLocation();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReferralRow | null>(null);
  const [uploadText, setUploadText] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadResult, setUploadResult] = useState<ReferralUploadReview | null>(
    null,
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const { referrals, deleteReferral, upsertManyReferrals } =
    useReferralsStore();

  const provinceOptions = useMemo(() => {
    const values = Array.from(
      new Set(referrals.map((item) => item.province)),
    ).sort();
    return [...values.map((value) => ({ label: value, value }))];
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

  const openCreate = () => {
    setLocation("/referrals/create");
  };

  const openView = (referral: ReferralRow) => {
    setLocation(`/referrals/${referral.id}`);
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
    <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
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
        onDelete={openDelete}
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
