import React, { useDeferredValue, useMemo, useState } from "react";

import { useReferredListQuery } from "@/api/update-user-referrer/update-referrer.hooks";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Users } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { ReferredListTable } from "./components/ReferredListTable";
import { mapReferredToRow } from "./data/update-user-referral";

export function ListReferredPage() {
  const { phone = "" } = (useParams() as { phone: string }) ?? {};
  const referrerPhoneNumber = phone;

  const [, setLocation] = useLocation();

  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const referredListQuery = useReferredListQuery({
    size: pageSize,
    page: currentIndex,
    referrerPhoneNumber,
    keyword: deferredSearchTerm,
  });

  const referrals = useMemo(
    () => referredListQuery.data?.content?.map(mapReferredToRow) ?? [],
    [referredListQuery.data?.content],
  );

  const listLoading =
    referredListQuery.isPending || referredListQuery.isFetching;
  const tableIndex = currentIndex + 1;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentIndex(0);
  };

  const handleGoBack = () => {
    setLocation("/referrals", { replace: true });
  };

  React.useEffect(() => {
    if (!referrerPhoneNumber) {
      handleGoBack();
    }
  }, [referrerPhoneNumber]);

  return (
    <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Quản trị hệ thống
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
              Danh sách người được giới thiệu bởi: {referrerPhoneNumber}
            </h2>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Nhập dữ liệu giới thiệu
          </Button>
        </div>
      </div>

      <ReferredListTable
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
    </section>
  );
}
