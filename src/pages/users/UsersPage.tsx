import { useDeferredValue, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { useLocation } from "wouter";
import { Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useUsersQuery } from "@/api/users/users.hooks";
import { mapUserItemToRow, userColumns } from "./data/api-users";

export default function UsersPage() {
  const [, setLocation] = useLocation();
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const apiStatusFilter =
    statusFilter === "all" ? undefined : statusFilter || undefined;

  const usersQuery = useUsersQuery({
    keyword: deferredSearchTerm.trim() || undefined,
    status: apiStatusFilter,
    page: currentIndex,
    size: pageSize,
  });

  const users = useMemo(
    () => usersQuery.data?.content?.map(mapUserItemToRow) ?? [],
    [usersQuery.data?.content],
  );

  const filters = useMemo(
    () => [
      {
        key: "status",
        label: "Trạng thái",
        options: [
          { label: "Hoạt động", value: "active" },
          { label: "Khóa", value: "locked" },
        ],
      },
    ],
    [],
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentIndex(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatusFilter(value);
      setCurrentIndex(0);
    }
  };

  const handlePageSize = (value: number) => {
    setPageSize(value);
    setCurrentIndex(0);
  };

  const loading = usersQuery.isPending || usersQuery.isFetching;
  const tableIndex = currentIndex + 1;

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
              Quản lý tài khoản
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Danh sách tài khoản được tải từ API, có thể tìm kiếm theo từ khóa
              và lọc theo trạng thái.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button onClick={() => setLocation("/users/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </div>

      <DataTable
        columns={userColumns}
        data={users}
        searchable
        onEdit={(item) => setLocation(`/users/${item.id}/edit`)}
        searchPlaceholder="Tìm kiếm theo mã, tên, email, tên đăng nhập..."
        filters={filters}
        onFilterChange={handleFilterChange}
        selectable={false}
        loading={loading}
        pageSize={pageSize}
        currentIndex={tableIndex}
        totalElements={usersQuery.data?.totalElements ?? 0}
        totalPages={usersQuery.data?.totalPages ?? 1}
        onSearch={handleSearch}
        onPageSize={handlePageSize}
        onIndexChange={(value) => setCurrentIndex(Math.max(0, value - 1))}
      />
    </section>
  );
}
