import { QUERY_KEY } from "@/constants/query-key.constant";
import { useQueryClient } from "@tanstack/react-query";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import {
  useBulkUploadReferredJobQuery,
  useBulkUploadReferredMutation,
  useReferredListQuery,
} from "@/api/update-user-referrer/update-referrer.hooks";
import { UpdateUserReferralPageHeader } from "./components/UpdateUserReferralPageHeader";
import { UpdateUserReferralTable } from "./components/UpdateUserReferralTable";
import { UpdateUserReferralUploadDialog } from "./components/UpdateUserReferralUploadDialog";
import {
  mapReferredToRow,
  updateUserReferralTemplateFileName,
  reviewUpdateReferralUploadText,
} from "./data/update-user-referral";

export function UpdateUserReferralsPage() {
  const queryClient = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadJobId, setUploadJobId] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Bulk upload result pagination
  const [resultPage, setResultPage] = useState(0);
  const [resultSize, setResultSize] = useState(20);

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const appliedUploadJobIdRef = useRef<number | null>(null);

  const referredListQuery = useReferredListQuery({
    size: pageSize,
    page: currentIndex,
    keyword: deferredSearchTerm,
  });

  const bulkUploadMutation = useBulkUploadReferredMutation();
  const uploadJobQuery = useBulkUploadReferredJobQuery(
    uploadJobId
      ? { jobExecutionId: uploadJobId, page: resultPage, size: resultSize }
      : null,
  );

  const referrals = useMemo(
    () => referredListQuery.data?.content?.map(mapReferredToRow) ?? [],
    [referredListQuery.data?.content],
  );

  const uploadReview = useMemo(
    () => reviewUpdateReferralUploadText(uploadText),
    [uploadText],
  );

  const uploadJob = uploadJobQuery.data ?? null;
  const uploadLoading =
    bulkUploadMutation.isPending || uploadJob?.status === "STARTED";
  const listLoading =
    referredListQuery.isPending || referredListQuery.isFetching;
  const tableIndex = currentIndex + 1;

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
      setResultPage(0);
    } catch {
      // Let the dialog stay open so the user can try again.
    }
  };

  const downloadUpdateUserReferralTemplate = () => {
    const link = document.createElement("a");
    link.href = `/${updateUserReferralTemplateFileName}`;
    link.download = updateUserReferralTemplateFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const resetUploadDialog = () => {
    setUploadText("");
    setUploadFileName("");
    setUploadFile(null);
    setUploadJobId(null);
    setResultPage(0);
    setResultSize(20);
    appliedUploadJobIdRef.current = null;
  };

  const onUploadFileLoaded = (text: string, fileName: string, file: File) => {
    setUploadText(text);
    setUploadFileName(fileName);
    setUploadFile(file);
    setUploadJobId(null);
    setResultPage(0);
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
      queryKey: QUERY_KEY.UPDATE_USER_REFERRAL.LIST,
    });
  }, [queryClient, uploadJob]);

  return (
    <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <UpdateUserReferralPageHeader onUploadClick={() => setUploadOpen(true)} />

      <UpdateUserReferralTable
        data={referrals}
        pageSize={pageSize}
        currentIndex={tableIndex}
        totalElements={referredListQuery.data?.totalElements ?? 0}
        totalPages={referredListQuery.data?.totalPages ?? 1}
        onSearch={handleSearch}
        onPageSize={setPageSize}
        onIndexChange={(value) => setCurrentIndex(Math.max(0, value - 1))}
        loading={listLoading}
      />

      <UpdateUserReferralUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        uploadFileName={uploadFileName}
        uploadReview={uploadReview}
        uploadJob={uploadJob}
        uploadLoading={uploadLoading}
        onFileLoaded={onUploadFileLoaded}
        onDownloadTemplate={downloadUpdateUserReferralTemplate}
        onSubmit={submitUpload}
        onReset={resetUploadDialog}
        resultPage={resultPage}
        resultSize={resultSize}
        onResultPageChange={setResultPage}
        onResultSizeChange={setResultSize}
      />
    </section>
  );
}
