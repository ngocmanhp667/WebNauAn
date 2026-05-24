import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-clay-50 text-ink-900 font-sans">
      <div className="pointer-events-none absolute -left-40 top-[-120px] h-[420px] w-[420px] rounded-full bg-sunset-400/30 blur-[90px]" />
      <div className="pointer-events-none absolute -right-32 top-[120px] h-[380px] w-[380px] rounded-full bg-sea-600/20 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[15%] h-[340px] w-[340px] rounded-full bg-amber-200/60 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-6 rounded-3xl border border-white/40 bg-white/60 p-8 shadow-float backdrop-blur lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sea-600 text-white">
                <span className="font-display text-xl">MN</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-700/60">
                  MamNgon
                </p>
                <h2 className="font-display text-2xl text-ink-900">
                  Bếp nhà trong lòng bàn tay
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm text-ink-700/80">
              <p>
                Lưu lại công thức, quản lý danh sách món ăn và chia sẻ trải
                nghiệm nấu nướng cùng bạn bè.
              </p>
              <div className="grid gap-3 rounded-2xl border border-clay-200 bg-clay-100/60 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-[0.25em] text-ink-700/60">
                    Hoạt động
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                    Trực tuyến
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink-900">
                      Kho công thức
                    </span>
                    <span className="text-ink-700/60">120+ món</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white">
                    <div className="h-2 w-[65%] rounded-full bg-sea-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 text-xs text-ink-700/70 sm:grid-cols-2">
              <div className="rounded-2xl border border-clay-200 bg-white/80 p-4">
                <p className="font-semibold text-ink-900">Lịch nấu tuần</p>
                <p>Gợi ý món ăn theo ngân sách và thời gian.</p>
              </div>
              <div className="rounded-2xl border border-clay-200 bg-white/80 p-4">
                <p className="font-semibold text-ink-900">Mẹo bếp nhanh</p>
                <p>Tổng hợp mẹo nấu ăn từ cộng đồng.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/85 p-8 shadow-float backdrop-blur lg:p-10">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
