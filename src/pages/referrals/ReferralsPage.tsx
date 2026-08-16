import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { QUERY_KEY } from "@/constants/query-key.constant";
import {
  useBulkUploadReferrerJobQuery,
  useBulkUploadReferrersMutation,
  useUpdateReferrerStatusMutation,
  useUpdateReferrerMutation,
  useReferrersQuery,
} from "@/api/referrers/referrers.hooks";
import {
  type ReferralUploadReview,
  mapReferrerToReferralRow,
  referralTemplateFileName,
  reviewReferralUploadText,
} from "./data/referrals";
import { ReferralListTable } from "./components/ReferralListTable";
import { ReferralPageHeader } from "./components/ReferralPageHeader";
import { ReferralEditDialog } from "./components/ReferralEditDialog";
import { ReferralStatusConfirmDialog } from "./components/ReferralStatusConfirmDialog";
import { ReferralUploadDialog } from "./components/ReferralUploadDialog";
import { getApiErrorDescription } from "@/lib/api-error";
import type { ReferralRow } from "./data/referrals";

export function ReferralsPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralRow | null>(
    null,
  );
  const [uploadText, setUploadText] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<ReferralUploadReview | null>(
    null,
  );
  const [uploadJobId, setUploadJobId] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedStatusReferral, setSelectedStatusReferral] =
    useState<ReferralRow | null>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const apiStatusFilter =
    statusFilter === "all" ? undefined : statusFilter || undefined;
  const appliedUploadJobIdRef = useRef<number | null>(null);
  const referrersQuery = useReferrersQuery({
    keyword: deferredSearchTerm,
    status: apiStatusFilter,
    page: currentIndex,
    size: pageSize,
  });
  const bulkUploadMutation = useBulkUploadReferrersMutation();
  const updateReferrerMutation = useUpdateReferrerMutation();
  const updateReferrerStatusMutation = useUpdateReferrerStatusMutation();
  const uploadJobQuery = useBulkUploadReferrerJobQuery(
    uploadJobId ? { jobExecutionId: uploadJobId } : null,
  );
  const referrals = useMemo(
    () => referrersQuery.data?.content?.map(mapReferrerToReferralRow) ?? [],
    [referrersQuery.data?.content],
  );

  const uploadReview = useMemo(
    () =>
      reviewReferralUploadText(
        uploadText,
        referrals.map((item) => item.phone),
      ),
    [referrals, uploadText],
  );

  const uploadJob = uploadJobQuery.data ?? null;
  const uploadLoading =
    bulkUploadMutation.isPending || uploadJob?.status === "STARTED";
  const listLoading = referrersQuery.isPending || referrersQuery.isFetching;
  const tableIndex = currentIndex + 1;
  const filters = useMemo(
    () => [
      {
        key: "statusValue",
        label: "Trạng thái",
        options: [
          { label: "Hoạt động", value: "active" },
          { label: "Không hoạt động", value: "inactive" },
        ],
      },
    ],
    [],
  );

  const openCreate = () => {
    setLocation("/referrals/create");
  };

  const openEdit = (referral: ReferralRow) => {
    setSelectedReferral(referral);
    setEditOpen(true);
  };

  const openStatusConfirm = (referral: ReferralRow) => {
    setSelectedStatusReferral(referral);
    setStatusOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentIndex(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "statusValue") {
      if (value === "all" || value === "active" || value === "inactive") {
        setStatusFilter(value);
      }
      setCurrentIndex(0);
    }
  };

  const submitUpload = async () => {
    if (!uploadFile) {
      return;
    }

    try {
      const result = await bulkUploadMutation.mutateAsync({
        file: uploadFile,
      });
      appliedUploadJobIdRef.current = null;
      setUploadJobId(result.jobExecutionId);
      setUploadResult(uploadReview);
    } catch {
      // Let the dialog stay open so the user can try again.
    }
  };

  const downloadReferralTemplate = () => {
    const link = document.createElement("a");
    link.href = `/${referralTemplateFileName}`;
    link.download = referralTemplateFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const resetUploadDialog = () => {
    setUploadText("");
    setUploadFileName("");
    setUploadFile(null);
    setUploadResult(null);
    setUploadJobId(null);
    appliedUploadJobIdRef.current = null;
  };

  const resetEditDialog = () => {
    setSelectedReferral(null);
  };

  const resetStatusDialog = () => {
    setSelectedStatusReferral(null);
  };

  const onUploadFileLoaded = (text: string, fileName: string, file: File) => {
    setUploadText(text);
    setUploadFileName(fileName);
    setUploadFile(file);
    setUploadResult(null);
    setUploadJobId(null);
    appliedUploadJobIdRef.current = null;
  };

  const handleListReferred = (referredPhone: string) => {
    setLocation(`/referrals/update-user/${referredPhone}/list-referred`);
  };

  useEffect(() => {
    if (!uploadJob || uploadJob.status === "STARTED") {
      return;
    }

    if (appliedUploadJobIdRef.current === uploadJob.jobExecutionId) {
      return;
    }

    appliedUploadJobIdRef.current = uploadJob.jobExecutionId;
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.REFERRERS.LIST,
    });
  }, [queryClient, uploadJob]);

  return (
    <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <ReferralPageHeader
        onUploadClick={() => setUploadOpen(true)}
        onCreateClick={openCreate}
      />

      <ReferralListTable
        data={referrals}
        pageSize={pageSize}
        currentIndex={tableIndex}
        onListReferred={handleListReferred}
        totalElements={referrersQuery.data?.totalElements ?? 0}
        totalPages={referrersQuery.data?.totalPages ?? 1}
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onPageSize={setPageSize}
        onIndexChange={(value) => setCurrentIndex(Math.max(0, value - 1))}
        loading={listLoading}
        onEdit={openEdit}
        onToggleStatus={openStatusConfirm}
      />

      <ReferralUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        uploadFileName={uploadFileName}
        uploadReview={uploadReview}
        uploadResult={uploadResult}
        uploadJob={uploadJob}
        uploadLoading={uploadLoading}
        onFileLoaded={onUploadFileLoaded}
        onDownloadTemplate={downloadReferralTemplate}
        onSubmit={submitUpload}
        onReset={resetUploadDialog}
      />

      <ReferralEditDialog
        open={editOpen}
        onOpenChange={(nextOpen) => {
          setEditOpen(nextOpen);
          if (!nextOpen) {
            resetEditDialog();
          }
        }}
        referral={selectedReferral}
        loading={updateReferrerMutation.isPending}
        onSubmit={async (values) => {
          if (!selectedReferral) {
            return;
          }

          try {
            await updateReferrerMutation.mutateAsync({
              referrerId: Number(selectedReferral.id),
              phoneNumber: values.phone,
              fullName: values.fullName,
              province: values.province,
              commune: values.commune,
            });

            toast({
              title: "Cập nhật người giới thiệu thành công",
              description: "Thông tin người giới thiệu đã được lưu lại.",
              duration: 2000,
            });
            setEditOpen(false);
            resetEditDialog();
          } catch (error) {
            console.error(error);
            toast({
              title: "Không thể cập nhật người giới thiệu",
              description: getApiErrorDescription(
                error,
                "Vui lòng kiểm tra lại thông tin và thử lại.",
              ),
              variant: "destructive",
              duration: 2000,
            });
          }
        }}
      />

      <ReferralStatusConfirmDialog
        open={statusOpen}
        onOpenChange={(nextOpen) => {
          setStatusOpen(nextOpen);
          if (!nextOpen) {
            resetStatusDialog();
          }
        }}
        referral={selectedStatusReferral}
        loading={updateReferrerStatusMutation.isPending}
        onConfirm={async () => {
          if (!selectedStatusReferral) {
            return;
          }

          try {
            await updateReferrerStatusMutation.mutateAsync({
              referrerId: Number(selectedStatusReferral.id),
              active: selectedStatusReferral.status !== "Hoạt động",
            });

            toast({
              title: "Cập nhật trạng thái người giới thiệu thành công",
              description: "Trạng thái đã được lưu lại.",
              duration: 2000,
            });
            setStatusOpen(false);
            resetStatusDialog();
          } catch (error) {
            console.error(error);
            toast({
              title: "Không thể cập nhật trạng thái",
              description: getApiErrorDescription(
                error,
                "Vui lòng thử lại sau.",
              ),
              variant: "destructive",
              duration: 2000,
            });
          }
        }}
      />
    </section>
  );
}
