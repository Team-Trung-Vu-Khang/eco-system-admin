// import { useLocation } from "wouter";
// import { ArrowLeft, UserPlus } from "lucide-react";
// import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
// import { accountPlatforms, createPlatformGrants } from "../data/permissions";
// import {
//   UserAccountForm,
//   type UserAccountFormValues,
// } from "../components/UserAccountForm";

// export function UsersCreatePage() {
//   const [, setLocation] = useLocation();
//   const initialValues: UserAccountFormValues = {
//     fullName: "",
//     email: "",
//     phone: "",
//     birthYear: "",
//     address: "",
//     referralName: "",
//     status: "active",
//     note: "",
//     platformGrants: createPlatformGrants(
//       accountPlatforms.map((platform) => platform.value),
//       "admin",
//     ),
//   };

//   return (
//     <section className="w-full space-y-6 rounded-3xl border border-black/5 bg-white/80 p-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
//       <div className="flex w-full flex-wrap items-start justify-between gap-4">
//         <div className="min-w-0 flex-1 space-y-3">
//           <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
//             <UserPlus className="h-3.5 w-3.5" />
//             Quản trị hệ thống
//           </div>
//           <div className="space-y-2">
//             <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 md:text-4xl">
//               Thêm mới tài khoản
//             </h2>
//             <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
//               Tạo mới tài khoản với thông tin định danh và phân quyền theo từng
//               phân hệ.
//             </p>
//           </div>
//         </div>

//         <div className="flex shrink-0 flex-wrap gap-2">
//           <Button
//             variant="outline"
//             type="button"
//             onClick={() => setLocation("/users")}
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Quay lại
//           </Button>
//         </div>
//       </div>

//       <UserAccountForm
//         title="Thông tin tài khoản"
//         description="Bổ sung thông tin người dùng cho từng phân hệ. Nếu thiếu thông tin định danh, hệ thống cần được cập nhật ngay khi tạo mới."
//         submitLabel="Tạo tài khoản"
//         initialValues={initialValues}
//         onSubmit={() => setLocation("/users")}
//         onCancel={() => setLocation("/users")}
//       />
//     </section>
//   );
// }
