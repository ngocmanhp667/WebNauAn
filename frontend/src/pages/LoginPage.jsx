import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAccount, resetAuthState, clearAuthError } from "../store/authSlice";
import FormMessage from "../components/FormMessage";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { status, error, token } = useSelector((state) => state.auth);
  
  const [form, setForm] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  
  const [clientError, setClientError] = useState("");
  const isLoading = status === "loading";

  // Reset auth state when mounting
  useEffect(() => {
    dispatch(resetAuthState());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  // Redirect to home if logged in successfully
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (clientError) setClientError("");
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!form.username.trim() || !form.password) {
      setClientError("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    dispatch(
      loginAccount({
        username: form.username.trim(),
        password: form.password,
      })
    );
  };

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
                  Đăng nhập & Trải nghiệm
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#cbd5e1]/80">
              <p>
                Đăng nhập để tiếp tục lên kế hoạch thực đơn dinh dưỡng cá nhân hóa, khám phá hàng trăm công thức hấp dẫn và kết nối cùng cộng đồng đầu bếp.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-[#2a2326] bg-[#1b181f]/40 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] text-[#f59e0b] text-lg">💡</span>
                  <div>
                    <p className="font-semibold text-white">Tối ưu dinh dưỡng</p>
                    <p className="text-xs text-[#cbd5e1]/60">AI tự phân tích calo, protein, carb, fat từ nguyên liệu.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#2a2326] bg-[#1b181f]/40 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] text-[#f59e0b] text-lg">🛒</span>
                  <div>
                    <p className="font-semibold text-white">Danh sách mua sắm thông minh</p>
                    <p className="text-xs text-[#cbd5e1]/60">Xuất danh sách nguyên liệu và kết nối nhanh tới Shopee/Tiki.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-dashed border-[#3a2e32] bg-[#1b181f]/50 p-4 text-center">
              <p className="text-xs text-[#cbd5e1]/70">
                Tài khoản dùng thử Admin mặc định:
              </p>
              <p className="text-xs font-mono text-[#f59e0b] mt-1">
                Username: <span className="text-white">admin</span> | Password: <span className="text-white">admin123</span>
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="rounded-3xl border border-[#2a2326] bg-[#141217]/95 p-8 shadow-float backdrop-blur-md lg:p-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.35em] text-[#f59e0b]">
                  Đăng nhập hệ thống
                </p>
                <h1 className="font-display text-3xl font-semibold text-white">
                  Mừng bạn trở lại!
                </h1>
                <p className="text-sm text-[#cbd5e1]/70">
                  Nhập thông tin tài khoản của bạn để khám phá ẩm thực ngay.
                </p>
              </div>

              {clientError ? (
                <FormMessage tone="error" title={clientError} />
              ) : error ? (
                <FormMessage
                  tone="error"
                  title="Đăng nhập thất bại"
                  description={error}
                />
              ) : null}

              <InputField
                label="Tên đăng nhập"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Tên đăng nhập hoặc username"
                autoComplete="username"
                required
              />

              <InputField
                label="Mật khẩu"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />

              <div className="flex items-center justify-between text-xs text-[#cbd5e1]/80">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#f59e0b]"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="font-semibold text-[#f59e0b] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập ngay"}
              </PrimaryButton>

              <p className="text-center text-xs text-[#cbd5e1]/70 mt-6">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#f59e0b] hover:underline"
                >
                  Đăng ký tài khoản mới
                </Link>
              </p>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
