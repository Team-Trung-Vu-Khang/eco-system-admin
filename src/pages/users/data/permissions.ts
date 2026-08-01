export const accountPlatforms = [
  { value: "edu", label: "Edu" },
  { value: "farm", label: "Farm" },
  { value: "factory", label: "Factory" },
  { value: "shop", label: "Shop" },
  { value: "system", label: "System" },
] as const;

export type AccountPlatform = (typeof accountPlatforms)[number]["value"];

export const accountRoles = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Quản lý" },
  { value: "operator", label: "Điều phối" },
  { value: "user", label: "Người dùng" },
  { value: "viewer", label: "Chỉ xem" },
] as const;

export type AccountRole = (typeof accountRoles)[number]["value"];

export const accountStatuses = [
  { value: "active", label: "Hoạt động" },
  { value: "locked", label: "Khóa" },
] as const;

export type AccountStatus = (typeof accountStatuses)[number]["value"];

export const accountPermissions = [
  { value: "view", label: "Xem" },
  { value: "create", label: "Tạo mới" },
  { value: "edit", label: "Cập nhật" },
  { value: "delete", label: "Xóa" },
  { value: "approve", label: "Duyệt" },
] as const;

export type AccountPermission = (typeof accountPermissions)[number]["value"];

export type PlatformGrant = {
  platform: AccountPlatform;
  role: AccountRole;
  permissions: string[];
};

export type PermissionMenuNode = {
  key: string;
  label: string;
  children?: PermissionMenuNode[];
};

const commonPermissionMenus: PermissionMenuNode[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "site-configuration", label: "Site Configuration" },
  { key: "customer-center", label: "Customer Center" },
  {
    key: "user-management",
    label: "User Management",
    children: [
      { key: "user-management-member", label: "Member Management" },
      { key: "user-management-education-managers", label: "Education Managers" },
      { key: "user-management-withdrawn-members", label: "Withdrawn Members" },
      { key: "user-management-instructors", label: "Instructors" },
      { key: "user-management-general-managers", label: "General Managers" },
    ],
  },
  {
    key: "member-history",
    label: "Member History",
    children: [
      { key: "member-history-counseling", label: "Counseling History" },
      { key: "member-history-certification", label: "Certification History" },
      { key: "member-history-verification", label: "Verification History" },
    ],
  },
  {
    key: "delivery-management",
    label: "Delivery Management",
    children: [
      { key: "delivery-management-details", label: "Delivery Details" },
      { key: "delivery-management-study-encouragement", label: "Study Encouragement" },
      { key: "delivery-management-template", label: "Template Management" },
    ],
  },
  {
    key: "course-management",
    label: "Course Management",
    children: [
      { key: "course-management-dashboard", label: "Course Dashboard" },
      { key: "course-management-list", label: "Course List" },
      { key: "course-management-categories", label: "Course Categories" },
      { key: "course-management-types", label: "Course Types" },
    ],
  },
  { key: "learning-management", label: "Learning Management" },
  {
    key: "content-management",
    label: "Content Management",
    children: [
      { key: "content-management-dashboard", label: "Content Dashboard" },
      { key: "content-management-list", label: "Content List" },
      { key: "content-management-lecture-parts", label: "Lecture Parts" },
      { key: "content-management-question-banks", label: "Question Banks" },
    ],
  },
];

export const platformLabels = Object.fromEntries(
  accountPlatforms.map((platform) => [platform.value, platform.label]),
) as Record<AccountPlatform, string>;

export const platformPermissionMenus = Object.fromEntries(
  accountPlatforms.map((platform) => [platform.value, commonPermissionMenus]),
) as Record<AccountPlatform, PermissionMenuNode[]>;

export const roleLabels = Object.fromEntries(
  accountRoles.map((role) => [role.value, role.label]),
) as Record<AccountRole, string>;

export const statusLabels = Object.fromEntries(
  accountStatuses.map((status) => [status.value, status.label]),
) as Record<AccountStatus, string>;

export function getPlatformLabel(value: AccountPlatform) {
  return platformLabels[value];
}

export function getRoleLabel(value: AccountRole) {
  return roleLabels[value];
}

export function getStatusLabel(value: AccountStatus) {
  return statusLabels[value];
}

export function getPlatformPermissionMenus(platform: AccountPlatform) {
  return platformPermissionMenus[platform];
}

export function getMenuLeafKeys(node: PermissionMenuNode): string[] {
  if (!node.children || node.children.length === 0) return [node.key];

  return node.children.flatMap((child) => getMenuLeafKeys(child));
}

export function getPermissionLeafKeys(
  nodes: PermissionMenuNode[],
): string[] {
  return nodes.flatMap((node) => getMenuLeafKeys(node));
}

export function getPermissionCountSummary(
  selectedKeys: string[],
  nodes: PermissionMenuNode[],
) {
  const leafCount = getPermissionLeafKeys(nodes).length;
  return `${selectedKeys.length}/${leafCount}`;
}

export function normalizePlatformValue(value: string): AccountPlatform {
  const normalized = value.trim().toLowerCase();
  const match = accountPlatforms.find(
    (platform) =>
      platform.value === normalized || platform.label.toLowerCase() === normalized,
  );

  if (normalized === "crm") return "system";
  if (normalized === "sales") return "shop";
  if (normalized === "support") return "factory";

  return match?.value ?? "edu";
}

export function normalizeRoleValue(value: string): AccountRole {
  const normalized = value.trim().toLowerCase();
  const match = accountRoles.find(
    (role) => role.value === normalized || role.label.toLowerCase() === normalized,
  );

  if (normalized === "quản trị viên") return "admin";
  if (normalized === "admin" || normalized === "quản trị") return "admin";
  if (normalized === "quản lý") return "manager";
  if (normalized === "điều phối") return "operator";
  if (normalized === "người dùng" || normalized === "user") return "user";
  if (normalized === "chỉ xem" || normalized === "viewer") return "viewer";

  return match?.value ?? "user";
}

export function normalizeStatusValue(value: string): AccountStatus {
  const normalized = value.trim().toLowerCase();
  const match = accountStatuses.find(
    (status) =>
      status.value === normalized || status.label.toLowerCase() === normalized,
  );

  return match?.value ?? "active";
}

export function getDefaultPermissionsForRole(role: AccountRole) {
  const leafKeys = getPermissionLeafKeys(commonPermissionMenus);
  switch (role) {
    case "admin":
      return leafKeys;
    case "manager":
      return leafKeys.slice(0, Math.min(8, leafKeys.length));
    case "operator":
      return leafKeys.slice(0, Math.min(6, leafKeys.length));
    case "viewer":
      return leafKeys.slice(0, Math.min(2, leafKeys.length));
    case "user":
    default:
      return leafKeys.slice(0, Math.min(4, leafKeys.length));
  }
}

export function createDefaultGrant(platform: AccountPlatform): PlatformGrant {
  return {
    platform,
    role: "user",
    permissions: getDefaultPermissionsForRole("user"),
  };
}

export function createPlatformGrants(
  platforms: AccountPlatform[],
  role: AccountRole = "user",
): PlatformGrant[] {
  return platforms.map((platform, index) => ({
    platform,
    role: index === 0 ? role : "user",
    permissions:
      index === 0 ? getDefaultPermissionsForRole(role) : getDefaultPermissionsForRole("user"),
  }));
}

export function summarizePlatformGrants(grants: PlatformGrant[]) {
  return grants
    .map((grant) => `${getPlatformLabel(grant.platform)}: ${getRoleLabel(grant.role)}`)
    .join(" • ");
}

export function summarizeRoleGrants(grants: PlatformGrant[]) {
  const uniqueRoles = Array.from(new Set(grants.map((grant) => grant.role)));
  return uniqueRoles.map((role) => getRoleLabel(role)).join(", ");
}
