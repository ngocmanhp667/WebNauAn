import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d0b0c] text-[#f3f4f6] font-sans">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute -left-40 top-[-120px] h-[420px] w-[420px] rounded-full bg-[#f59e0b]/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 top-[120px] h-[380px] w-[380px] rounded-full bg-[#c2410c]/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[15%] h-[340px] w-[340px] rounded-full bg-[#f59e0b]/10 blur-[140px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          {/* Info Section */}
          <div className="flex flex-col justify-center gap-6 rounded-3xl border border-[#2a2326] bg-[#141217]/90 p-8 shadow-float backdrop-blur-md lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f59e0b] text-[#111111]">
                <span className="font-display text-xl font-bold">MN</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
                  MâmNgon
                </p>
                <h2 className="font-display text-2xl font-semibold text-white">
                  Bếp nhà trong lòng bàn tay
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#cbd5e1]/80">
              <p>
                Lưu lại công thức, quản lý danh sách món ăn, lên thực đơn theo ngân sách và chia sẻ trải nghiệm nấu nướng tuyệt vời cùng cộng đồng yêu bếp.
              </p>
              
              <div className="grid gap-3 rounded-2xl border border-[#2a2326] bg-[#1b181f]/80 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-[0.25em] text-[#cbd5e1]/60">
                    Trạng thái cộng đồng
                  </span>
                  <span className="rounded-full bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 text-emerald-400 font-semibold">
                    Live
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white">
                      Kho công thức nấu ăn
                    </span>
                    <span className="text-[#f59e0b] font-semibold">500+ món</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#2a2326]">
                    <div className="h-2 w-[85%] rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 text-xs text-[#cbd5e1]/70 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#2a2326] bg-[#141217]/50 p-4">
                <p className="font-semibold text-white mb-1">📅 Thực đơn tuần AI</p>
                <p>AI thông minh tự thiết lập thực đơn 7 ngày khớp ngân sách của bạn.</p>
              </div>
              <div className="rounded-2xl border border-[#2a2326] bg-[#141217]/50 p-4">
                <p className="font-semibold text-white mb-1">💡 Mẹo nấu ăn nhanh</p>
                <p>Tổng hợp hàng trăm mẹo vặt, cách sơ chế nguyên liệu từ các chuyên gia.</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="rounded-3xl border border-[#2a2326] bg-[#141217]/95 p-8 shadow-float backdrop-blur-md lg:p-10">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
