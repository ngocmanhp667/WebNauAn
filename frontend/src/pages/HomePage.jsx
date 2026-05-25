import TopProductsSection from "../components/TopProductsSection.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutAccount } from "../store/authSlice";

const categories = [
  {
    title: "Món chính",
    description: "Món ăn đầy đủ chất cho bữa tối",
  },
  {
    title: "Món phụ",
    description: "Món kèm nhẹ để cân bằng bữa ăn",
  },
  {
    title: "Tráng miệng",
    description: "Kết thúc bữa ăn ngọt ngào",
  },
  {
    title: "Đồ uống",
    description: "Công thức nước uống tự nhiên",
  },
  {
    title: "Ăn vặt",
    description: "Nhanh gọn, hấp dẫn",
  },
];

const featuredRecipes = [
  {
    title: "Gà nướng thảo mộc",
    tag: "Món chính",
    time: "45 phút",
    difficulty: "Trung bình",
    rating: "4.8",
  },
  {
    title: "Bún bò tại nhà",
    tag: "Món chính",
    time: "60 phút",
    difficulty: "Khó",
    rating: "4.9",
  },
  {
    title: "Salad cá hồi",
    tag: "Món phụ",
    time: "20 phút",
    difficulty: "Dễ",
    rating: "4.7",
  },
];

const latestRecipes = [
  {
    title: "Cháo yến mạch",
    description: "Công thức biểu tượng cho bữa sáng nhanh gọn.",
    time: "15 phút",
    calories: "320 kcal",
  },
  {
    title: "Súp bí đỏ",
    description: "Ấm bụng, giàu chất xơ và vitamin A.",
    time: "30 phút",
    calories: "280 kcal",
  },
  {
    title: "Sinh tố xanh",
    description: "Xay lá cải, táo và chuối cho năng lượng sạch.",
    time: "10 phút",
    calories: "190 kcal",
  },
];

const learningSteps = [
  {
    title: "Tuần 1",
    subtitle: "Bếp lành mạnh cơ bản",
    points: [
      "Nắm bộ nguyên tắc dinh dưỡng cơ bản",
      "Sắp xếp bữa ăn theo lịch cá nhân",
      "Tạo danh sách mua sắm tối ưu",
      "Cân bằng nhóm chất theo khẩu phần",
    ],
  },
  {
    title: "Tuần 2",
    subtitle: "Thực đơn theo mục tiêu",
    points: [
      "Thiết lập ngân sách ăn uống thực tế",
      "Gợi ý món ăn theo mục tiêu sức khỏe",
      "Định lượng calo và macro dễ hiểu",
      "Lưu công thức và đánh giá cộng đồng",
    ],
  },
  {
    title: "Tuần 3",
    subtitle: "Tăng tốc với AI",
    points: [
      "Tạo thực đơn 7 ngày chỉ trong 1 phút",
      "Chatbot dinh dưỡng trả lời tức thì",
      "Tự động gợi ý link nguyên liệu",
      "Theo dõi tiến độ ăn uống thông minh",
    ],
  },
];

const checklist = [
  "Lập thực đơn theo ngân sách mỗi ngày",
  "Công thức được cộng đồng chấm điểm thực tế",
  "Gợi ý món ăn theo mục tiêu dinh dưỡng",
  "Tối ưu thời gian nấu cho người bận rộn",
  "Lưu và chia sẻ công thức yêu thích",
  "Kết nối chuyên gia dinh dưỡng uy tín",
];

const scheduleItems = [
  { icon: "📅", label: "Lịch học: Thứ 7 · 30/5 · 6/6 · 13/6" },
  { icon: "🕕", label: "Khung giờ: 16:00 - 17:30 (Giờ VN)" },
  { icon: "💳", label: "Học phí: 4.999.000 VNĐ" },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAccount());
  };

  return (
    <div className="bg-[#0d0b0c] text-[#f3f4f6]">
      <header className="relative overflow-hidden border-b border-[#1f1b1c]">
        <div className="pointer-events-none absolute -left-24 top-[-140px] h-[340px] w-[340px] rounded-full bg-[#f59e0b]/25 blur-[130px]" />
        <div className="pointer-events-none absolute right-[-90px] top-[140px] h-[300px] w-[300px] rounded-full bg-[#c2410c]/20 blur-[140px]" />

        <div className="border-b border-[#1f1b1c] bg-[#141217]/90">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-xs text-[#cbd5e1]/70 lg:px-10">
            <span className="rounded-full bg-[#1b1410] px-3 py-1 font-semibold text-[#f59e0b]">
              Live online · 3 buổi tư vấn
            </span>
            <span>Hỗ trợ thực đơn miễn phí cho tuần đầu tiên</span>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-10 lg:px-10">
          <nav className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f59e0b] text-[#111111]">
                <span className="font-display text-lg">NM</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
                  NutriMeal
                </p>
                <p className="font-display text-lg">
                  Nấu thông minh, ăn lành mạnh
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#e5e7eb]">
              <a className="transition hover:text-[#f59e0b]" href="#recipes">
                Công thức
              </a>
              <a className="transition hover:text-[#f59e0b]" href="#categories">
                Danh mục
              </a>
              <a className="transition hover:text-[#f59e0b]" href="#ai">
                Thực đơn AI
              </a>
              <Link className="transition hover:text-[#f59e0b]" to="/search">
                Tìm kiếm
              </Link>
              {user ? (
                <>
                  <Link className="transition hover:text-[#f59e0b] border-l border-[#2a2326] pl-3 text-[#f59e0b]" to="/profile">
                    Hồ sơ ({user.fullName || user.full_name || user.username})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full bg-[#1b1410] border border-red-500/30 px-3 py-1.5 text-xs text-red-400 font-semibold shadow-float transition hover:-translate-y-0.5 hover:bg-red-500 hover:text-white"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link className="transition hover:text-[#f59e0b]" to="/login">
                    Đăng nhập
                  </Link>
                  <Link
                    className="rounded-full bg-[#f59e0b] px-4 py-2 text-xs text-[#111111] shadow-float transition hover:-translate-y-0.5 hover:bg-[#fbbf24]"
                    to="/register"
                  >
                    Tạo tài khoản
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#cbd5e1]/60">
                Trung tâm bếp thông minh
              </p>
              <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                Chia sẻ công thức và lập thực đơn thông minh
              </h1>
              <p className="mt-4 text-base text-[#cbd5e1]/80">
                NutriMeal kết nối cộng đồng yêu bếp, gợi ý bữa ăn theo ngân sách
                và mục tiêu dinh dưỡng.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {checklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[#2a2326] bg-[#141217]/90 px-4 py-3 text-sm text-[#d1d5db]/80"
                  >
                    <span className="mt-1 text-[#f59e0b]">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#recipes"
                  className="rounded-2xl bg-[#f59e0b] px-6 py-3 text-sm font-semibold text-[#111111] shadow-float transition hover:-translate-y-0.5 hover:bg-[#fbbf24]"
                >
                  Khám phá công thức
                </a>
                <a
                  href="#ai"
                  className="rounded-2xl border border-[#3a2e32] bg-[#141217]/90 px-6 py-3 text-sm font-semibold text-[#e5e7eb] shadow-sm transition hover:-translate-y-0.5 hover:border-[#f59e0b]/50 hover:text-[#f59e0b]"
                >
                  Thử thực đơn AI
                </a>
                <div className="flex items-center gap-2 rounded-2xl border border-[#2a2326] bg-[#141217]/90 px-4 py-3 text-xs font-semibold text-[#cbd5e1]/70">
                  <span className="text-[#f59e0b]">0đ</span>
                  <span>miễn phí tuần đầu</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#2a2326] bg-[#141217]/95 p-8 shadow-float backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
                  Lịch tư vấn tháng này
                </p>
                <span className="rounded-full bg-[#1b1410] px-3 py-1 text-xs font-semibold text-[#f59e0b]">
                  Suất giới hạn
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl">
                Thực đơn 7 ngày cho người bận rộn
              </h3>
              <p className="mt-2 text-sm text-[#cbd5e1]/70">
                AI gợi ý 3 bữa chính + snack, tối ưu ngân sách và thời gian.
              </p>
              <div className="mt-6 space-y-4">
                {scheduleItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-[#2a2326] bg-[#1b1410]/60 px-4 py-3 text-xs font-semibold text-[#e5e7eb]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#111111] text-base">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="flex-1 rounded-2xl bg-[#f59e0b] px-5 py-3 text-sm font-semibold text-[#111111] transition hover:-translate-y-0.5 hover:bg-[#fbbf24]">
                  Đăng ký ngay
                </button>
                <button className="flex-1 rounded-2xl border border-[#3a2e32] bg-[#141217] px-5 py-3 text-sm font-semibold text-[#e5e7eb] transition hover:-translate-y-0.5 hover:border-[#f59e0b]/50 hover:text-[#f59e0b]">
                  Xem lịch học
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-[#0d0b0c]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
                Nội dung chính
              </p>
              <h2 className="mt-3 font-display text-3xl">
                Chương trình 3 tuần thực hành
              </h2>
              <p className="mt-3 text-sm text-[#cbd5e1]/70">
                Từ nền tảng dinh dưỡng đến lập thực đơn tự động bằng AI.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {learningSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-[#2a2326] bg-[#141217] p-6 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-[#cbd5e1]/60">
                  {step.title}
                </p>
                <h3 className="mt-3 font-display text-xl text-ink-900">
                  {step.subtitle}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-[#cbd5e1]/70">
                  {step.points.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#f59e0b]">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="mx-auto max-w-6xl px-6 py-16 lg:px-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
              Danh mục
            </p>
            <h2 className="mt-3 font-display text-3xl">
              Khám phá theo danh mục
            </h2>
          </div>
          <a className="text-sm font-semibold text-[#f59e0b]" href="/search">
            Xem tất cả danh mục
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-3xl border border-[#2a2326] bg-[#141217] p-6 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-[#cbd5e1]/60">
                {category.title}
              </p>
              <p className="mt-3 text-sm text-[#cbd5e1]/70">
                {category.description}
              </p>
              <button className="mt-6 rounded-full border border-[#3a2e32] px-4 py-2 text-xs font-semibold text-[#e5e7eb]">
                Khám phá
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="recipes" className="bg-[#0d0b0c]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
                Nổi bật
              </p>
              <h2 className="mt-3 font-display text-3xl">Công thức nổi bật</h2>
            </div>
            <a className="text-sm font-semibold text-[#f59e0b]" href="/search">
              Xem tất cả công thức
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredRecipes.map((recipe) => (
              <div
                key={recipe.title}
                className="group rounded-3xl border border-[#2a2326] bg-[#141217] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-float"
              >
                <div className="flex items-center justify-between text-xs text-[#cbd5e1]/60">
                  <span>{recipe.tag}</span>
                  <span>{recipe.rating} ★</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink-900">
                  {recipe.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-[#1b181f] px-3 py-1">
                    {recipe.time}
                  </span>
                  <span className="rounded-full bg-[#1b181f] px-3 py-1">
                    {recipe.difficulty}
                  </span>
                </div>
                <button className="mt-6 rounded-2xl bg-[#f59e0b] px-4 py-2 text-xs font-semibold text-[#111111] transition hover:-translate-y-0.5 hover:bg-[#fbbf24]">
                  Xem công thức
                </button>
              </div>
            ))}
          </div>

          <TopProductsSection />

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-[#2a2326] bg-[#141217] p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
                Công thức mới nhất
              </p>
              <div className="mt-6 space-y-4">
                {latestRecipes.map((recipe) => (
                  <div
                    key={recipe.title}
                    className="flex flex-col gap-2 rounded-2xl border border-[#2a2326] bg-[#1b181f] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-ink-900">
                        {recipe.title}
                      </p>
                      <p className="text-xs text-[#cbd5e1]/70">
                        {recipe.description}
                      </p>
                    </div>
                    <div className="text-xs text-[#cbd5e1]/60">
                      <span className="mr-3">{recipe.time}</span>
                      <span>{recipe.calories}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#2a2326] bg-gradient-to-br from-[#111111] to-[#1b1410] p-8 text-white shadow-float">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Điểm nhấn cộng đồng
              </p>
              <h3 className="mt-4 font-display text-2xl">
                500+ đánh giá mới mỗi tháng
              </h3>
              <p className="mt-3 text-sm text-white/80">
                Đánh giá thực tế từ người nấu giúp bạn chọn công thức phù hợp.
              </p>
              <div className="mt-6 space-y-3 text-xs text-white/80">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  "Món gà nướng rất dễ làm, gia vị vừa miệng." — Minh An
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  "Meal plan giúp mình tiết kiệm hơn 25%." — Thanh Hà
                </div>
              </div>
              <button className="mt-6 w-full rounded-2xl bg-white/15 px-4 py-2 text-xs font-semibold text-white">
                Tham gia cộng đồng
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="ai" className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
              Thực đơn AI
            </p>
            <h2 className="mt-3 font-display text-3xl">
              Tạo thực đơn thông minh theo ngân sách
            </h2>
            <p className="mt-4 text-sm text-[#cbd5e1]/70">
              Nhập ngân sách, mục tiêu và số người. AI sẽ gợi ý thực đơn 7 ngày
              kèm lượng calo và chi phí dự kiến.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Giảm cân", "Tăng cơ", "Ăn lành mạnh", "Tiết kiệm"].map(
                (goal) => (
                  <span
                    key={goal}
                    className="rounded-full border border-[#2a2326] bg-[#141217] px-4 py-2 text-xs font-semibold text-[#e5e7eb]"
                  >
                    {goal}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[#2a2326] bg-[#141217] p-8 shadow-float">
            <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
              Thiết lập nhanh
            </p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-[#2a2326] bg-[#1b181f] p-4">
                <p className="text-xs text-[#cbd5e1]/60">Ngân sách / ngày</p>
                <p className="mt-2 font-semibold">80.000 VNĐ</p>
              </div>
              <div className="rounded-2xl border border-[#2a2326] bg-[#1b181f] p-4">
                <p className="text-xs text-[#cbd5e1]/60">Khẩu phần</p>
                <p className="mt-2 font-semibold">2 người</p>
              </div>
              <div className="rounded-2xl border border-[#2a2326] bg-[#1b181f] p-4">
                <p className="text-xs text-[#cbd5e1]/60">Số ngày</p>
                <p className="mt-2 font-semibold">7 ngày</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-2xl bg-[#f59e0b] px-5 py-3 text-sm font-semibold text-[#111111] transition hover:-translate-y-0.5 hover:bg-[#fbbf24]">
              Tạo thực đơn AI
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1f1b1c] bg-[#141217]">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-[#cbd5e1]/70 lg:px-10">
          <p>NutriMeal 2026. Xây dựng cho bếp lành mạnh.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/" className="font-semibold text-[#f3f4f6]">
              Trang chủ
            </a>
            <a href="/search">Tìm kiếm</a>
            <a href="/register">Đăng ký</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
