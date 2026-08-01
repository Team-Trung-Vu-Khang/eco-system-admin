import { useMemo, useState } from "react";
import { Plus, Upload, UserRound, Users } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImportUsersDialog } from "./components/ImportUsersDialog";
import { userColumns, type UserRow } from "./data/table";
import {
  accountPermissions,
  getPlatformLabel,
  getRoleLabel,
  getStatusLabel,
} from "./data/permissions";
import { useUsers } from "./hooks/useUsers";

export default function UsersPage() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const selectedGrantPlatform = useMemo(
    () => selectedUser?.platformGrants[0]?.platform ?? "",
    [selectedUser],
  );
  const {
    users,
    loading,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    handleSearch,
    deleteOpen,
    setDeleteOpen,
    importOpen,
    setImportOpen,
    handleDelete,
    handleConfirmDelete,
    handleImportData,
    upsertManyUsers,
    setLocation,
    isDeleting,
    filters,
    handleFilterChange,
  } = useUsers();

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
              Quản lý tài khoản
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Danh sách tài khoản theo nền tảng, vai trò và trạng thái. Bạn có
              thể tìm kiếm, lọc, xem quyền, sửa, xóa và nhập dữ liệu ngay tại
              đây.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Nhập dữ liệu
          </Button>
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
        onView={(item) => {
          setSelectedUser(item);
          setInfoOpen(true);
        }}
        onEdit={(item) => setLocation(`/users/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm người dùng..."
        filters={filters}
        onFilterChange={handleFilterChange}
        selectable={false}
        loading={loading}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onSearch={handleSearch}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa người dùng này? Hoạt động này không thể hoàn tác."
        loading={isDeleting}
      />

      <ImportUsersDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        existingEmails={users.map((user) => user.email)}
        onImport={(rows) => {
          upsertManyUsers(rows);
          handleImportData();
        }}
      />

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden border-0 bg-white p-0 shadow-none sm:max-w-4xl">
          {selectedUser ? (
            <div className="bg-white px-6 py-6">
              <DialogHeader className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <DialogTitle className="text-2xl font-semibold tracking-[-0.04em] text-slate-900">
                      {selectedUser.fullName}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm leading-6 text-slate-500">
                      {selectedUser.description}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={selectedUser.status === "active" ? "secondary" : "destructive"}
                  >
                    {getStatusLabel(selectedUser.status)}
                  </Badge>
                  <Badge variant="outline">{getPlatformLabel(selectedUser.platform)}</Badge>
                  <Badge variant="outline">{getRoleLabel(selectedUser.role)}</Badge>
                  <span className="text-sm text-slate-500">
                    Đăng nhập gần nhất: {selectedUser.lastLoginAt}
                  </span>
                </div>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Email
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedUser.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Số điện thoại
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedUser.phone}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Năm sinh
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedUser.birthYear}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Địa chỉ
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedUser.address}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Người giới thiệu
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedUser.referralName || "Không có"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Ghi chú
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {selectedUser.description}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Phân quyền theo phân hệ
                      </p>
                      <p className="text-sm leading-6 text-slate-500">
                        Mỗi phân hệ có thể giữ một vai trò và bộ quyền khác nhau.
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {selectedUser.platformGrants.length} phân hệ
                    </Badge>
                  </div>

                  <Tabs
                    defaultValue={selectedGrantPlatform}
                    className="space-y-4"
                  >
                    <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-slate-100 p-1">
                      {selectedUser.platformGrants.map((grant) => (
                        <TabsTrigger
                          key={grant.platform}
                          value={grant.platform}
                          className="rounded-2xl px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                          {getPlatformLabel(grant.platform)}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {selectedUser.platformGrants.map((grant) => (
                      <TabsContent key={grant.platform} value={grant.platform}>
                        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                              {getPlatformLabel(grant.platform)}
                            </p>
                              <p className="mt-2 text-sm leading-6 text-slate-500">
                              Vai trò hiện tại: {getRoleLabel(grant.role)}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              Quyền bật: {grant.permissions.length}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                              Danh sách quyền
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {grant.permissions.map((permission) => (
                                <Badge key={permission} variant="secondary">
                                  {accountPermissions.find((item) => item.value === permission)?.label ?? permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
