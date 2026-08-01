import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  accountPlatforms,
  accountRoles,
  accountStatuses,
  createPlatformGrants,
  getPlatformLabel,
  getRoleLabel,
  getStatusLabel,
  normalizePlatformValue,
  normalizeRoleValue,
  normalizeStatusValue,
  summarizePlatformGrants,
  summarizeRoleGrants,
} from "../data/permissions";
import type { UserRow } from "../data/table";

export const seedUsers: UserRow[] = [
  {
    id: "u-1",
    fullName: "Nguyễn Văn A",
    email: "a@example.com",
    phone: "0901 234 567",
    birthYear: "1992",
    address: "Q.1, TP.HCM",
    referralName: "Trần Thị B",
    role: "admin",
    platform: "edu",
    status: "active",
    lastLoginAt: "31/07/2026 09:15",
    description: "Quản trị viên chính của hệ thống, phụ trách cấu hình và phân quyền.",
    platformGrants: [
      { platform: "edu", role: "admin", permissions: ["view", "create", "edit", "delete", "approve"] },
      { platform: "farm", role: "user", permissions: ["view", "create"] },
    ],
  },
  {
    id: "u-2",
    fullName: "Trần Thị B",
    email: "b@example.com",
    phone: "0902 345 678",
    birthYear: "1995",
    address: "Ninh Kiều, Cần Thơ",
    referralName: "Nguyễn Văn A",
    role: "user",
    platform: "farm",
    status: "active",
    lastLoginAt: "31/07/2026 13:42",
    description: "Người dùng nội bộ, thường xuyên truy cập để theo dõi dữ liệu.",
    platformGrants: [
      { platform: "farm", role: "user", permissions: ["view", "create"] },
      { platform: "system", role: "viewer", permissions: ["view"] },
    ],
  },
  {
    id: "u-3",
    fullName: "Lê Văn C",
    email: "c@example.com",
    phone: "0903 456 789",
    birthYear: "1989",
    address: "Thủ Đức, TP.HCM",
    referralName: "Phạm Thị D",
    role: "manager",
    platform: "system",
    status: "locked",
    lastLoginAt: "29/07/2026 18:20",
    description: "Tài khoản đang tạm khóa do chưa xác nhận lại thông tin.",
    platformGrants: [
      { platform: "system", role: "manager", permissions: ["view", "create", "edit", "approve", "delete"] },
      { platform: "factory", role: "viewer", permissions: ["view"] },
    ],
  },
]

export function getUsersLinkedToReferral(referralName: string) {
  return seedUsers.filter((user) => user.referralName === referralName);
}

export function useUsers() {
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<UserRow[]>(seedUsers);
  const [loading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters] = useState([
    {
      key: "platform",
      label: "Nền tảng",
      options: accountPlatforms.map((platform) => ({
        label: platform.label,
        value: platform.value,
      })),
    },
    {
      key: "role",
      label: "Vai trò",
      options: accountRoles.map((role) => ({
        label: role.label,
        value: role.value,
      })),
    },
    {
      key: "status",
      label: "Trạng thái",
      options: accountStatuses.map((status) => ({
        label: status.label,
        value: status.value,
      })),
    },
  ]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [
          user.fullName,
          user.email,
          user.phone,
          user.referralName,
          user.role,
          user.platform,
          user.status,
          getPlatformLabel(user.platform),
          getRoleLabel(user.role),
          getStatusLabel(user.status),
          summarizePlatformGrants(user.platformGrants),
          summarizeRoleGrants(user.platformGrants),
          user.lastLoginAt,
          user.description,
          user.birthYear,
          user.address,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesRole =
        !activeFilters.role ||
        user.platformGrants.some((grant) => grant.role === activeFilters.role);
      const matchesPlatform =
        !activeFilters.platform ||
        user.platformGrants.some((grant) => grant.platform === activeFilters.platform);
      const matchesStatus =
        !activeFilters.status || user.status === activeFilters.status;

      return matchesSearch && matchesRole && matchesPlatform && matchesStatus;
    });
  }, [activeFilters.platform, activeFilters.role, activeFilters.status, searchTerm, users]);

  const response = useMemo(
    () => ({
      totalElements: filteredUsers.length,
      totalPages: Math.max(1, Math.ceil(filteredUsers.length / pageSize)),
    }),
    [filteredUsers.length, pageSize],
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentIndex(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((current) => ({ ...current, [key]: value }));
    setCurrentIndex(0);
  };

  const handleDelete = (user: UserRow) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      setUsers((current) => current.filter((user) => user.id !== selectedUser.id));
      setDeleteOpen(false);
      setSelectedUser(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImportData = async () => {
    setImportOpen(false);
  };

  const upsertManyUsers = (entries: Array<
    Pick<UserRow, "fullName" | "email" | "phone" | "referralName" | "role" | "status">
  >) => {
    if (entries.length === 0) return;

    setUsers((current) => {
      const next = [...current];

      for (const entry of entries) {
        const existingIndex = next.findIndex(
          (user) => user.email.toLowerCase() === entry.email.toLowerCase(),
        );

        const payload: UserRow = {
          id:
            existingIndex >= 0
              ? next[existingIndex].id
              : `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          fullName: entry.fullName,
          email: entry.email,
          phone: entry.phone,
          birthYear: "1995",
          address: "Chưa bổ sung",
          referralName: entry.referralName,
          role: normalizeRoleValue(entry.role),
          platform: normalizePlatformValue("edu"),
          status: normalizeStatusValue(entry.status),
          lastLoginAt: "Chưa có",
          description: `Tài khoản được import từ file dữ liệu.`,
          platformGrants: createPlatformGrants(["edu"], normalizeRoleValue(entry.role)),
        };

        if (existingIndex >= 0) {
          next[existingIndex] = {
            ...next[existingIndex],
            ...payload,
          };
        } else {
          next.unshift(payload);
        }
      }

      return next;
    });
  };

  return {
    users: filteredUsers,
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
  };
}
