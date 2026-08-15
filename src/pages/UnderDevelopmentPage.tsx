import { Construction, ArrowLeft, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export function UnderDevelopmentPage() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/referrals");
    }
  };

  return (
    <section className="relative flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50/50 via-white/80 to-slate-50/50 p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.04)] backdrop-blur-md md:p-12">
      {/* Background Decorative Glows */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Main Glass Card */}
      <div className="relative z-10 flex max-w-lg flex-col items-center space-y-8 rounded-2xl border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.03)] backdrop-blur-lg">
        {/* Animated Icon Container */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/10 opacity-75" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-lg shadow-orange-500/20">
            <Construction className="h-10 w-10 animate-bounce" />
          </div>
          {/* Sparkles */}
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 animate-pulse text-amber-500" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700 uppercase">
            Tính năng đang phát triển
          </span>
          <h2 className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Đang Xây Dựng Hệ Thống
          </h2>
          <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
            Chức năng quản lý và phân quyền tài khoản người dùng đang được hoàn
            thiện. Chúng tôi sẽ cập nhật trong thời gian sớm nhất.
          </p>
        </div>
        {/* Actions */}
        <button
          onClick={handleBack}
          className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Quay lại trang trước
        </button>
      </div>
    </section>
  );
}
