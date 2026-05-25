import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, uploadUserAvatar, logoutAccount, clearAuthError } from "../store/authSlice";
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

const navigationItems = [
  { label: 'Thông tin cá nhân', icon: '👤', active: true },
  { label: 'Mật khẩu & Bảo mật', icon: '🔒', active: false },
  { label: 'Thông báo', icon: '🔔', active: false },
  { label: 'Công thức đã lưu', icon: '🔖', active: false },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token, profileStatus, profileError } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('Thông tin cá nhân');
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    bio: "",
    dailyBudget: "",
    cuisinePreferences: [],
    facebookUrl: "",
    instagramUsername: ""
  });

  const [clientMessage, setClientMessage] = useState(null);
  const fileInputRef = useRef(null);

  const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://') || avatarUrl.startsWith('data:')) {
      return avatarUrl;
    }
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    return `${apiBaseUrl}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setClientMessage({
        tone: "error",
        title: "Tệp không hợp lệ",
        description: "Vui lòng chọn một file hình ảnh (PNG, JPG, JPEG, WEBP, GIF)."
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setClientMessage({
        tone: "error",
        title: "Kích thước quá lớn",
        description: "Kích thước hình ảnh tối đa là 5MB."
      });
      return;
    }

    dispatch(uploadUserAvatar(file)).then((actionResult) => {
      if (uploadUserAvatar.fulfilled.match(actionResult)) {
        setClientMessage({
          tone: "success",
          title: "Cập nhật ảnh đại diện thành công",
          description: "Ảnh đại diện của bạn đã được cập nhật thành công."
        });
      } else {
        setClientMessage({
          tone: "error",
          title: "Tải ảnh lên thất bại",
          description: actionResult.payload || "Đã xảy ra lỗi khi tải ảnh đại diện lên."
        });
      }
    });
  };

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
            : [],
        facebookUrl: user.facebookUrl || user.facebook_url || "",
        instagramUsername: user.instagramUsername || user.instagram_username || ""
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
        cuisinePreferences: form.cuisinePreferences,
        facebookUrl: form.facebookUrl.trim() || null,
        instagramUsername: form.instagramUsername.trim() || null
      })
    ).then((actionResult) => {
      if (updateUserProfile.fulfilled.match(actionResult)) {
        setClientMessage({
          tone: "success",
          title: "Cập nhật thành công!",
          description: "Thông tin hồ sơ và sở thích của bạn đã được cập nhật."
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

      <div className="mx-auto max-w-5xl px-6 -mt-16 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
          
          {/* Left Column: Side Navigation & Avatar */}
          <div className="flex flex-col gap-6">
            
            {/* User Card */}
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#2a2326] bg-[#141217] p-6 shadow-float backdrop-blur-md">
              {/* Interactive Avatar Container */}
              <div className="relative group/avatar cursor-pointer animate-fadeIn" onClick={handleAvatarClick} title="Nhấp vào để đổi ảnh đại diện">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#2a2326] bg-[#1b181f] overflow-hidden shadow-xl transition-all duration-300 group-hover/avatar:border-[#f59e0b]/60 relative">
                  {user.avatar_url || user.avatarUrl ? (
                    <img 
                      src={getAvatarUrl(user.avatar_url || user.avatarUrl)} 
                      alt={form.fullName || user.username} 
                      className="h-full w-full object-cover transition-all duration-500 group-hover/avatar:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${form.fullName || user.username}`;
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-[#111111] text-4xl font-bold">
                      {avatarChar}
                    </div>
                  )}

                  {/* Dark Glassmorphic hover overlay */}
                  <div className="absolute inset-0 bg-[#000000]/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                    <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"></path>
                    </svg>
                    <span className="text-[10px] font-semibold text-white tracking-wide">Đổi ảnh</span>
                  </div>

                  {/* Loading Spinner Overlay */}
                  {isUpdating && (
                    <div className="absolute inset-0 bg-[#000000]/70 flex items-center justify-center z-10">
                      <div className="h-6 w-6 rounded-full border-2 border-t-[#f59e0b] border-r-transparent border-b-[#f59e0b] border-l-transparent animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Visual badge indicator for camera */}
                <div className="absolute bottom-0 right-0 bg-[#141217] border border-[#2a2326] text-white p-1.5 rounded-full shadow-md group-hover/avatar:border-[#f59e0b] transition-colors duration-300">
                  <svg className="w-3.5 h-3.5 text-[#cbd5e1] group-hover/avatar:text-[#f59e0b] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"></path>
                  </svg>
                </div>
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div className="text-center w-full">
                <h2 className="text-lg font-bold text-white truncate px-2 animate-fadeIn">
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
            </div>

            {/* Aside Navigation List */}
            <div className="rounded-3xl border border-[#2a2326] bg-[#141217] p-4 shadow-float">
              <aside className="w-full space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.label)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors text-sm font-semibold ${
                      activeTab === item.label
                        ? "bg-[#1b1410] text-[#f59e0b] border border-[#f59e0b]/20"
                        : "text-[#cbd5e1] hover:bg-[#1b181f] hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}

                <div className="pt-4 mt-4 border-t border-[#2a2326]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-red-400 transition-colors hover:bg-red-950/20 hover:text-red-300 font-semibold text-sm"
                  >
                    <span>🚪</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </aside>
            </div>

          </div>

          {/* Right Column: Dynamic Form Area */}
          <div className="rounded-3xl border border-[#2a2326] bg-[#141217]/95 p-8 shadow-float backdrop-blur-md">
            
            {activeTab === 'Thông tin cá nhân' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <h3 className="font-display text-2xl font-semibold text-white animate-fadeIn">
                    Cài đặt hồ sơ
                  </h3>
                  <p className="text-sm text-[#cbd5e1]/60 mt-1">
                    Quản lý thông tin công khai và tùy chọn cá nhân của bạn.
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
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-xs uppercase tracking-[0.3em] text-[#f59e0b] font-semibold border-b border-[#2a2326] pb-2">
                    1. Thông tin liên lạc
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
                    <label className="text-xs font-semibold text-[#cbd5e1]">Giới thiệu bản thân (Bio)</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Chia sẻ đôi chút về niềm đam mê ẩm thực của bạn..."
                      className="w-full rounded-2xl border border-[#2a2326] bg-[#1b181f] px-4 py-3 text-sm text-[#f3f4f6] placeholder-[#cbd5e1]/30 focus:border-[#f59e0b] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Section 2: Mạng xã hội */}
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <h4 className="text-xs uppercase tracking-[0.3em] text-[#f59e0b] font-semibold border-b border-[#2a2326] pb-2">
                    2. Mạng xã hội
                  </h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      label="Liên kết Facebook"
                      name="facebookUrl"
                      value={form.facebookUrl}
                      onChange={handleChange}
                      placeholder="https://facebook.com/username"
                    />
                    <InputField
                      label="Instagram Username"
                      name="instagramUsername"
                      value={form.instagramUsername}
                      onChange={handleChange}
                      placeholder="username_instagram"
                    />
                  </div>
                </div>

                {/* Section 3: Dinh dưỡng & Ngân sách */}
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <h4 className="text-xs uppercase tracking-[0.3em] text-[#f59e0b] font-semibold border-b border-[#2a2326] pb-2">
                    3. Sở thích ẩm thực & Ngân sách
                  </h4>

                  <InputField
                    label="Ngân sách ăn uống hàng ngày (VNĐ)"
                    name="dailyBudget"
                    value={form.dailyBudget}
                    onChange={handleChange}
                    placeholder="80000"
                    helperText="AI sẽ dựa trên ngân sách này để tính toán thực đơn hợp lý cho bạn."
                  />

                  {/* Cuisines dynamic tags */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#cbd5e1]">Sở thích ẩm thực</label>
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
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition duration-300 ${
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
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-4">🚧</span>
                <h3 className="text-xl font-bold text-white">Tính năng đang phát triển</h3>
                <p className="text-sm text-[#cbd5e1]/60 mt-1 max-w-sm">
                  Tab "{activeTab}" đang được tích hợp thêm dữ liệu và sẽ sớm ra mắt trong bản cập nhật tới!
                </p>
              </div>
            )}
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
