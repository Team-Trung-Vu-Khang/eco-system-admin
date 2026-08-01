import { useState } from "react";
import {
  Button,
  AutoCompleteSelect,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  accountPlatforms,
  accountRoles,
  type AccountPlatform,
  type AccountRole,
  type AccountStatus,
  createPlatformGrants,
  getDefaultPermissionsForRole,
  getMenuLeafKeys,
  getPlatformLabel,
  getPlatformPermissionMenus,
  type PlatformGrant,
  type PermissionMenuNode,
} from "../data/permissions";
import { referralNameOptions } from "../data/referrals";

export type UserAccountFormValues = {
  fullName: string;
  email: string;
  phone: string;
  birthYear: string;
  address: string;
  referralName: string;
  status: AccountStatus;
  note: string;
  platformGrants: PlatformGrant[];
};

type UserAccountFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  initialValues?: UserAccountFormValues;
  onSubmit: (values: UserAccountFormValues) => void;
  onCancel: () => void;
};

const defaultValues: UserAccountFormValues = {
  fullName: "",
  email: "",
  phone: "",
  birthYear: "",
  address: "",
  referralName: "",
  status: "active",
  note: "",
  platformGrants: createPlatformGrants(
    accountPlatforms.map((item) => item.value),
  ),
};

function getMenuSelectionState(
  node: PermissionMenuNode,
  selectedKeys: Set<string>,
) {
  const leafKeys = getMenuLeafKeys(node);
  const selectedCount = leafKeys.filter((key) => selectedKeys.has(key)).length;
  const checked = selectedCount === leafKeys.length;
  const indeterminate = selectedCount > 0 && selectedCount < leafKeys.length;

  return { checked, indeterminate };
}

function PermissionTreeNode({
  node,
  selectedKeys,
  onToggle,
  depth = 0,
}: {
  node: PermissionMenuNode;
  selectedKeys: Set<string>;
  onToggle: (node: PermissionMenuNode, checked: boolean) => void;
  depth?: number;
}) {
  const state = getMenuSelectionState(node, selectedKeys);
  const hasChildren = Boolean(node.children?.length);

  return (
    <div className={depth === 0 ? "space-y-2" : "space-y-1"}>
      <label
        className={`flex items-start gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-slate-50 ${
          depth === 0 ? "" : "ml-1"
        }`}
      >
        <Checkbox
          checked={state.indeterminate ? "indeterminate" : state.checked}
          onCheckedChange={(value) => onToggle(node, Boolean(value))}
          className={"mt-1"}
        />
        <span className="min-w-0 leading-6">
          <span className={"block font-medium text-slate-900"}>
            {node.label}
          </span>
        </span>
      </label>

      {hasChildren ? (
        <div className="grid gap-x-8 gap-y-1 pl-6 sm:grid-cols-2">
          {node.children?.map((child) => (
            <PermissionTreeNode
              key={child.key}
              node={child}
              selectedKeys={selectedKeys}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function UserAccountForm({
  title,
  description,
  submitLabel,
  initialValues,
  onSubmit,
  onCancel,
}: UserAccountFormProps) {
  const [form, setForm] = useState<UserAccountFormValues>({
    ...defaultValues,
    ...initialValues,
    platformGrants:
      initialValues?.platformGrants ?? defaultValues.platformGrants,
  });
  const [activePlatform, setActivePlatform] = useState<AccountPlatform>(
    form.platformGrants[0]?.platform ?? accountPlatforms[0].value,
  );

  const updateField = <K extends keyof UserAccountFormValues>(
    key: K,
    value: UserAccountFormValues[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateGrant = (
    platform: AccountPlatform,
    updater: (grant: PlatformGrant) => PlatformGrant,
  ) => {
    setForm((current) => ({
      ...current,
      platformGrants: current.platformGrants.map((grant) =>
        grant.platform === platform ? updater(grant) : grant,
      ),
    }));
  };

  const handleRoleChange = (platform: AccountPlatform, role: AccountRole) => {
    updateGrant(platform, (grant) => ({
      ...grant,
      role,
      permissions: getDefaultPermissionsForRole(role),
    }));
  };

  const handleNodeToggle = (
    platform: AccountPlatform,
    node: PermissionMenuNode,
    checked: boolean,
  ) => {
    updateGrant(platform, (grant) => {
      const nextPermissions = new Set(grant.permissions);
      for (const key of getMenuLeafKeys(node)) {
        if (checked) {
          nextPermissions.add(key);
        } else {
          nextPermissions.delete(key);
        }
      }

      return { ...grant, permissions: Array.from(nextPermissions) };
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="grid gap-5"
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.96fr)]">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" required>
                Họ và tên
              </Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" required>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="user@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" required>
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="0901 234 567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthYear" required>
                Năm sinh
              </Label>
              <Input
                id="birthYear"
                inputMode="numeric"
                value={form.birthYear}
                onChange={(event) =>
                  updateField("birthYear", event.target.value)
                }
                placeholder="1995"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" required>
                Địa chỉ
              </Label>
              <Input
                id="address"
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Nhập địa chỉ liên hệ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralName" required>
                Người giới thiệu
              </Label>
              <AutoCompleteSelect
                options={referralNameOptions}
                value={form.referralName}
                onChange={(value) => updateField("referralName", value)}
                placeholder="Chọn người giới thiệu"
                searchPlaceholder="Tìm theo người giới thiệu..."
                emptyText="Không tìm thấy người giới thiệu"
                clearable
                autocomplete
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" required>
                Trạng thái
              </Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  updateField("status", value as AccountStatus)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "active", label: "Hoạt động" },
                    { value: "locked", label: "Khóa" },
                  ].map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={form.note}
              onChange={(event) => updateField("note", event.target.value)}
              placeholder="Nhập ghi chú cho người dùng..."
              className="min-h-32"
            />
          </div>
        </section>

        <section className="space-y-4 xl:sticky xl:top-6">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Phân quyền theo phân hệ
            </p>
            <p className="text-sm leading-6 text-slate-500">
              Mỗi tab là một phân hệ. Một tài khoản có thể giữ vai trò khác nhau
              trên từng phân hệ.
            </p>
          </div>

          <Tabs
            value={activePlatform}
            onValueChange={(value) =>
              setActivePlatform(value as AccountPlatform)
            }
          >
            <TabsList>
              {accountPlatforms.map((platform) => (
                <TabsTrigger key={platform.value} value={platform.value}>
                  {platform.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {accountPlatforms.map((platform) => {
              const grant =
                form.platformGrants.find(
                  (item) => item.platform === platform.value,
                ) ?? form.platformGrants[0];
              const selectedKeys = new Set(grant?.permissions ?? []);
              const menuNodes = getPlatformPermissionMenus(platform.value);

              return (
                <TabsContent
                  key={platform.value}
                  value={platform.value}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {getPlatformLabel(platform.value)}
                    </p>
                    <p className="text-sm leading-6 text-slate-500">
                      Chọn vai trò và menu cha/con cho phân hệ này.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`role-${platform.value}`} required>
                      Vai trò
                    </Label>
                    <Select
                      value={grant?.role}
                      onValueChange={(value) =>
                        handleRoleChange(platform.value, value as AccountRole)
                      }
                    >
                      <SelectTrigger id={`role-${platform.value}`}>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
                    {menuNodes.map((node) => (
                      <div
                        key={node.key}
                        className="border-t border-slate-100 pt-3 first:border-t-0 first:pt-0"
                      >
                        <PermissionTreeNode
                          node={node}
                          selectedKeys={selectedKeys}
                          onToggle={(currentNode, checked) =>
                            handleNodeToggle(
                              platform.value,
                              currentNode,
                              checked,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </section>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
