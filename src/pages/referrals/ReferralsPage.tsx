import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { QUERY_KEY } from "@/constants/query-key.constant";
import {
  useBulkUploadReferrerJobQuery,
  useBulkUploadReferrersMutation,
  useReferrersQuery,
} from "@/api/referrers/referrers.hooks";
import {
  type ReferralRow,
  type ReferralUploadReview,
  buildReferralTemplateWorkbook,
  mapReferrerToReferralRow,
  referralTemplateFileName,
  reviewReferralUploadText,
} from "./data/referrals";
import { ReferralListTable } from "./components/ReferralListTable";
import { ReferralPageHeader } from "./components/ReferralPageHeader";
import { ReferralUploadDialog } from "./components/ReferralUploadDialog";

export function ReferralsPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
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
  const appliedUploadJobIdRef = useRef<number | null>(null);
  const referrersQuery = useReferrersQuery({
    keyword: searchTerm.trim() || undefined,
    page: currentIndex,
    size: pageSize,
  });
  const bulkUploadMutation = useBulkUploadReferrersMutation();
  const uploadJobQuery = useBulkUploadReferrerJobQuery(
    uploadJobId ? { jobExecutionId: uploadJobId } : null,
  );
  const referrals = useMemo(
    () =>
      referrersQuery.data?.content?.map(mapReferrerToReferralRow) ?? [],
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

  const openCreate = () => {
    setLocation("/referrals/create");
  };

  const openView = (referral: ReferralRow) => {
    setLocation(`/referrals/${referral.id}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentIndex(0);
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
    const workbook = buildReferralTemplateWorkbook();
    const binary = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([binary], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = referralTemplateFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const resetUploadDialog = () => {
    setUploadText("");
    setUploadFileName("");
    setUploadFile(null);
    setUploadResult(null);
    setUploadJobId(null);
    appliedUploadJobIdRef.current = null;
  };

  const onUploadFileLoaded = (text: string, fileName: string, file: File) => {
    setUploadText(text);
    setUploadFileName(fileName);
    setUploadFile(file);
    setUploadResult(null);
    setUploadJobId(null);
    appliedUploadJobIdRef.current = null;
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
        currentIndex={currentIndex}
        totalElements={referrersQuery.data?.totalElements ?? 0}
        totalPages={referrersQuery.data?.totalPages ?? 1}
        onSearch={handleSearch}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        onView={openView}
        loading={listLoading}
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
    </section>
  );
}
