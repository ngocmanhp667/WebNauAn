import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerAccount } from "../store/authSlice";
import { verifyOtpApi } from "../services/authApi";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setMessage("Vui lòng điền đầy đủ các thông tin.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const username = email.split("@")[0];
      const fullName = `${lastName} ${firstName}`;

      const resultAction = await dispatch(
        registerAccount({
          username,
          email,
          password,
          full_name: fullName
        })
      );

      if (registerAccount.fulfilled.match(resultAction)) {
        setMessage("Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(resultAction.payload || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setMessage(err.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setMessage("Vui lòng nhập đầy đủ mã OTP 6 chữ số.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await verifyOtpApi(email, otpCode);
      setMessage("Xác thực thành công! Đang chuyển hướng sang trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.message || "Mã OTP không chính xác hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop font-body-md select-none">
      <main className="w-full max-w-max-width bg-surface-container-lowest rounded-xl overflow-hidden shadow-soft flex flex-col md:flex-row min-h-[700px] border border-outline-variant/10">
        {/* Left Side: Image Content */}
        <section
          className="hidden md:flex md:w-1/2 relative overflow-hidden items-end p-lg bg-cover bg-center"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dofssbkbd/image/upload/v1782819020/mamngon/assets/ruqetfu0x7b3gtjemwjx.jpg')",
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
              <h2 className="font-headline-md text-headline-md text-primary mb-xs font-bold">
                {showOtpScreen ? "Kích hoạt tài khoản" : "Tạo tài khoản mới"}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {showOtpScreen ? "Nhập mã xác thực để kích hoạt tài khoản của bạn." : "Bắt đầu chia sẻ những công thức bí mật của bạn."}
              </p>
            </div>
            
            {message && (
              <div className={`mb-4 p-3 rounded-lg font-label-sm whitespace-pre-line ${message.includes("thành công") ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container"}`}>
                {message}
              </div>
            )}
            
            {showOtpScreen ? (
              /* OTP verification Form */
              <form onSubmit={handleOtpSubmit} className="space-y-md">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="otp-code">Mã OTP (6 chữ số)</label>
                  <input
                    className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface"
                    id="otp-code"
                    placeholder="123456"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Chúng tôi đã gửi một mã OTP gồm 6 chữ số vào email của bạn. Vui lòng kiểm tra hộp thư.</p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-md bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:brightness-95 active:scale-95 transition-all font-bold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  ) : (
                    "Xác Nhận Kích Hoạt"
                  )}
                </button>
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSubmit} className="space-y-md">
                <div className="grid grid-cols-2 gap-sm">
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="first-name">Họ</label>
                    <input
                      className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface"
                      id="first-name"
                      placeholder="Nguyễn"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="last-name">Tên</label>
                    <input
                      className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface"
                      id="last-name"
                      placeholder="An"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="signup-email">Email</label>
                  <input
                    className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface"
                    id="signup-email"
                    placeholder="example@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="signup-password">Mật khẩu</label>
                  <input
                    className="w-full px-md py-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface"
                    id="signup-password"
                    placeholder="Tối thiểu 8 ký tự"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    "Tạo Tài Khoản"
                  )}
                </button>
              </form>
            )}
            
            {/* Divider */}
            <div className="relative my-lg">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/20"></div>
              </div>
              <div className="relative flex justify-center text-label-sm text-label-sm">
                <span className="px-sm bg-surface-container-lowest text-on-surface-variant">Hoặc tiếp tục với</span>
              </div>
            </div>
            
            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-sm mb-lg">
              <button className="flex items-center justify-center gap-xs py-sm border border-outline-variant/30 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors text-secondary font-bold">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-xs py-sm border border-outline-variant/30 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors text-secondary font-bold">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                Facebook
              </button>
            </div>
            
            {/* Toggle */}
            <div className="text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;
