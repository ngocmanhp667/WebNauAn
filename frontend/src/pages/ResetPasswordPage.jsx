import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ các thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop font-body-md select-none">
      <main className="w-full max-w-max-width bg-surface-container-lowest rounded-xl overflow-hidden shadow-soft flex flex-col md:flex-row min-h-[700px] border border-outline-variant/10">
        {/* Left Side: Image Content */}
        <section
          className="hidden md:flex md:w-1/2 relative overflow-hidden items-end p-lg bg-cover bg-center"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida/ADBb0ujSJCjN5rjcVNsvELodQ-YXgqxcz1-kC7sa7V-0_WpcQyjCmXvZHKuvTN1XqysPK2MYQzhBBLTrKXq_bolH4w9GZcccVP6Thz_8LgHtI5elOGtRTgNX78ff34v5G91cVW7aToAqK2AbtQux9fpR497jnUHaWR6C2sHdKJmDytb4ve8Z0yP-9Q3YFhglxHRL9cR9oY4nhmCID15NNqyjP4PO-qOAhBKr4g4ANuouuF9xMyWFJKrLyfkt')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
          <div className="relative z-10 text-white select-none">
            <h1 className="font-display-lg text-display-lg mb-sm font-bold">CulinShare</h1>
            <p className="font-body-lg text-body-lg opacity-90 max-w-md leading-relaxed">
              Tham gia cộng đồng những người yêu ẩm thực, chia sẻ công thức nấu ăn tinh tế và tìm thấy nguồn cảm hứng mỗi ngày trong căn bếp của bạn.
            </p>
          </div>
        </section>
        
        {/* Right Side: Auth Form */}
        <section className="w-full md:w-1/2 flex flex-col justify-center px-md py-lg md:px-xl bg-surface-container-lowest">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-primary mb-xs font-bold">Đặt lại mật khẩu</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Tạo mật khẩu mới cho tài khoản của bạn.</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-label-sm">
                {error}
              </div>
            )}
            
            {success ? (
              <div className="space-y-4">
                <div className="p-4 bg-tertiary/10 text-tertiary rounded-lg font-body-md leading-relaxed border border-tertiary/20">
                  Mật khẩu của bạn đã được thay đổi thành công!
                </div>
                <Link
                  to="/login"
                  className="w-full py-md bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:brightness-95 active:scale-95 transition-all font-bold text-center block"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-md">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="new-password">Mật khẩu mới</label>
                  <input
                    className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface"
                    id="new-password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
                  <input
                    className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface"
                    id="confirm-password"
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-md bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:brightness-95 active:scale-95 transition-all font-bold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
