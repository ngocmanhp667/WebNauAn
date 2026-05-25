import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, logoutAccount, clearAuthError } from "../store/authSlice";
import FormMessage from "../components/FormMessage";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

const PRESET_CUISINES = [
  "Món chính",
  "Món phụ",
  "Món chay",
  "Lẩu",
  "Khai vị",
  "Tráng miệng",
  "Đồ uống",
  "Ăn vặt",
  "Hải sản",
  "Món cay"
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token, profileStatus, profileError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    bio: "",
    dailyBudget: "",
    cuisinePreferences: []
  });

  const [clientMessage, setClientMessage] = useState(null);

  // Redirect to login if guest
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  // Load profile data into form when user state loads
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || user.full_name || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        dailyBudget: user.dailyBudget || user.daily_budget || "",
        cuisinePreferences: Array.isArray(user.cuisinePreferences || user.cuisine_preferences) 
          ? user.cuisinePreferences || user.cuisine_preferences 
          : typeof (user.cuisinePreferences || user.cuisine_preferences) === 'string'
            ? [user.cuisinePreferences || user.cuisine_preferences]
            : []
      });
    }
  }, [user]);

  // Clear messages on destroy
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (clientMessage) setClientMessage(null);
    if (profileError) dispatch(clearAuthError());
  };

  const handleToggleCuisine = (cuisine) => {
    setForm((prev) => {
      const current = prev.cuisinePreferences;
      const updated = current.includes(cuisine)
        ? current.filter((item) => item !== cuisine)
        : [...current, cuisine];
      return {
        ...prev,
        cuisinePreferences: updated
      };
    });

    if (clientMessage) setClientMessage(null);
  };

  const handleLogout = () => {
    dispatch(logoutAccount());
    navigate("/");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setClientMessage(null);

    // Validate daily budget if entered
    if (form.dailyBudget && (isNaN(Number(form.dailyBudget)) || Number(form.dailyBudget) <= 0)) {
      setClientMessage({
        tone: "error",
        title: "Ngân sách không hợp lệ",
        description: "Ngân sách hàng ngày phải là một số dương lớn hơn 0."
      });
      return;
    }

    dispatch(
      updateUserProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        bio: form.bio.trim() || null,
        dailyBudget: form.dailyBudget ? Number(form.dailyBudget) : null,
        cuisinePreferences: form.cuisinePreferences
      })
    ).then((actionResult) => {
      if (updateUserProfile.fulfilled.match(actionResult)) {
        setClientMessage({
          tone: "success",
          title: "Cập nhật thành công!",
          description: "Thông tin hồ sơ và dinh dưỡng của bạn đã được cập nhật."
        });
      }
    });
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0b0c] text-white">
        <p>Đang tải thông tin hồ sơ của bạn...</p>
      </div>
    );
  }

  const isUpdating = profileStatus === "loading";
  const avatarChar = (form.fullName || user.username || "U").substring(0, 1).toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#0d0b0c] text-[#f3f4f6] font-sans pb-16">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute -left-40 top-[-120px] h-[420px] w-[420px] rounded-full bg-[#f59e0b]/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 top-[120px] h-[380px] w-[380px] rounded-full bg-[#c2410c]/10 blur-[120px]" />

      {/* Header Banner */}
      <div className="h-48 w-full bg-gradient-to-r from-[#1b1410] via-[#141217] to-[#1b1410] relative border-b border-[#1f1b1c] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495521821757-a1efb6729352')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b0c] to-transparent" />
        
        {/* Navigation link back to home */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            to="/" 
            className="flex items-center gap-2 rounded-full border border-[#2a2326] bg-[#141217]/80 px-4 py-2 text-xs font-semibold text-[#cbd5e1] hover:text-white hover:border-[#f59e0b] transition"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 -mt-16 relative z-10">
        <div className="grid gap-6 md:grid-cols-[1fr_2.2fr]">
          
          {/* Left Column: Avatar and Quick Stats */}
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-[#2a2326] bg-[#141217] p-6 shadow-float backdrop-blur-md">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#2a2326] bg-[#f59e0b] text-[#111111] text-4xl font-bold shadow-md">
              {avatarChar}
            </div>

            <div className="text-center w-full">
              <h2 className="text-xl font-bold text-white truncate px-2">
                {form.fullName || user.username}
              </h2>
              <p className="text-xs text-[#cbd5e1]/60 mt-1">@{user.username}</p>
              
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="rounded-full bg-[#1b1410] px-3 py-1 text-[10px] font-semibold text-[#f59e0b] border border-[#f59e0b]/20">
                  {user.role === 'admin' ? 'Administrator' : 'Thành viên'}
                </span>
                {user.is_verified ? (
                  <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                    Đã xác thực
                  </span>
                ) : null}
              </div>
            </div>

            <hr className="w-full border-[#2a2326]" />

            {/* User credentials details */}
            <div className="w-full space-y-3 text-xs text-[#cbd5e1]/80">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#cbd5e1]/40">Email của bạn</p>
                <p className="font-semibold text-white mt-0.5 truncate">{user.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#cbd5e1]/40">Ngày đăng ký</p>
                <p className="font-semibold text-white mt-0.5">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString("vi-VN") : "Hôm nay"}
                </p>
              </div>
            </div>

            <hr className="w-full border-[#2a2326]" />

            <button 
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl border border-red-500/30 bg-red-950/20 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              Đăng xuất tài khoản
            </button>
          </div>

          {/* Right Column: Information Forms */}
          <div className="rounded-3xl border border-[#2a2326] bg-[#141217]/95 p-8 shadow-float backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">
                  Thiết lập hồ sơ cá nhân
                </h3>
                <p className="text-sm text-[#cbd5e1]/60 mt-1">
                  Cập nhật các tùy chọn dinh dưỡng và thông tin cá nhân của bạn.
                </p>
              </div>

              {clientMessage ? (
                <FormMessage 
                  tone={clientMessage.tone} 
                  title={clientMessage.title} 
                  description={clientMessage.description}
                />
              ) : profileError ? (
                <FormMessage
                  tone="error"
                  title="Cập nhật thất bại"
                  description={profileError}
                />
              ) : null}

              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-[0.3em] text-[#f59e0b] font-semibold border-b border-[#2a2326] pb-2">
                  1. Thông tin cá nhân
                </h4>
                
                <InputField
                  label="Họ và tên"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nguyen Van A"
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Số điện thoại"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0912345678"
                  />
                  <InputField
                    label="Địa chỉ"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Quận 1, TP. Hồ Chí Minh"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#cbd5e1]">Tiểu sử (Bio)</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Chia sẻ đôi chút về niềm đam mê ẩm thực của bạn..."
                    className="w-full rounded-2xl border border-[#2a2326] bg-[#1b181f] px-4 py-3 text-sm text-[#f3f4f6] placeholder-[#cbd5e1]/30 focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]/50"
                  />
                </div>
              </div>

              {/* Section 2: Nutrition & Budget Preferences */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs uppercase tracking-[0.3em] text-[#f59e0b] font-semibold border-b border-[#2a2326] pb-2">
                  2. Sở thích dinh dưỡng & ngân sách
                </h4>

                <InputField
                  label="Ngân sách ăn uống hàng ngày (VNĐ)"
                  name="dailyBudget"
                  value={form.dailyBudget}
                  onChange={handleChange}
                  placeholder="80000"
                  helperText="AI sẽ dựa trên ngân sách này để tính toán thực đơn hợp lý cho bạn."
                />

                {/* Cuisine Tags selection */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#cbd5e1]">Sở thích ẩm thực của bạn</label>
                    <p className="text-[11px] text-[#cbd5e1]/50 mt-0.5">Chọn các chủ đề ẩm thực bạn quan tâm (Có thể chọn nhiều):</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {PRESET_CUISINES.map((cuisine) => {
                      const isSelected = form.cuisinePreferences.includes(cuisine);
                      return (
                        <button
                          key={cuisine}
                          type="button"
                          onClick={() => handleToggleCuisine(cuisine)}
                          className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
                            isSelected
                              ? "border-[#f59e0b] bg-[#1b1410] text-[#f59e0b]"
                              : "border-[#2a2326] bg-[#1b181f] text-[#cbd5e1]/80 hover:border-[#f59e0b]/50"
                          }`}
                        >
                          {cuisine} {isSelected ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <PrimaryButton type="submit" disabled={isUpdating}>
                  {isUpdating ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
                </PrimaryButton>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
