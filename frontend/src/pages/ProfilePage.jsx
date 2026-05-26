import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { logoutAccount, uploadUserAvatar } from "../store/authSlice";
import { getProfileApi, updateProfileApi } from "../services/authApi";
import { getImageUrl } from "../services/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.fullName || user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfileApi();
        setName(data.full_name || data.fullName || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setPhone(data.phone || "");
        setFacebook(data.facebook_url || data.facebookUrl || "");
        setInstagram(data.instagram_username || data.instagramUsername || "");

        // Sync with Redux and localStorage
        localStorage.setItem("user", JSON.stringify(data));
        dispatch({
          type: "auth/updateUserProfile/fulfilled",
          payload: data
        });
      } catch (err) {
        console.error("Lỗi khi tải profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutAccount());
    navigate("/login");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const resultAction = await dispatch(uploadUserAvatar(file));
      if (uploadUserAvatar.fulfilled.match(resultAction)) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        alert(resultAction.payload || "Lỗi khi tải lên ảnh đại diện");
      }
    } catch (err) {
      alert(err.message || "Lỗi khi tải lên ảnh đại diện");
    } finally {
      setLoading(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateProfileApi({
        avatarUrl: ""
      });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({
        type: "auth/updateUserProfile/fulfilled",
        payload: updatedUser
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      alert(err.message || "Lỗi khi xóa ảnh đại diện");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateProfileApi({
        fullName: name,
        email,
        bio,
        phone,
        facebookUrl: facebook,
        instagramUsername: instagram
      });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({
        type: "auth/updateUserProfile/fulfilled",
        payload: updatedUser
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      alert(err.message || "Lỗi khi cập nhật profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      <Header />
      
      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-lg flex-grow w-full">
        <div className="flex flex-col md:flex-row gap-lg">
          {/* Side Navigation */}
          <aside className="w-full md:w-64 shrink-0 select-none">
            <div className="space-y-base">
              <a className="flex items-center gap-sm px-md py-3 rounded-lg bg-primary-container/10 text-primary font-bold transition-all shadow-sm" href="#">
                <span className="material-symbols-outlined text-sm font-bold">person</span>
                <span className="font-label-md text-label-md">Thông tin cá nhân</span>
              </a>
              <a className="flex items-center gap-sm px-md py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="font-label-md text-label-md">Mật khẩu & Bảo mật</span>
              </a>
              <a className="flex items-center gap-sm px-md py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">notifications</span>
                <span className="font-label-md text-label-md">Thông báo</span>
              </a>
              <Link to="/saved-recipes" className="flex items-center gap-sm px-md py-3 rounded-lg text-secondary hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-sm">bookmark</span>
                <span className="font-label-md text-label-md">Công thức đã lưu</span>
              </Link>
              
              <div className="pt-lg">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-sm px-md py-3 rounded-lg text-error hover:bg-error-container/10 transition-colors text-left font-bold"
                >
                  <span className="material-symbols-outlined text-sm font-bold">logout</span>
                  <span className="font-label-md text-label-md">Đăng xuất</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-grow">
            <div className="mb-lg select-none">
              <h1 className="font-headline-md text-headline-md text-on-surface mb-xs font-bold">Cài đặt hồ sơ</h1>
              <p className="text-on-surface-variant font-body-md">Quản lý thông tin công khai và cài đặt tài khoản của bạn.</p>
            </div>
            
            <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-soft border border-outline-variant/10">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center md:flex-row md:items-start gap-md mb-lg border-b border-outline-variant/20 pb-lg">
                <div className="relative group cursor-pointer select-none">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-high shadow-sm">
                    <img
                      alt="User avatar preview"
                      className="w-full h-full object-cover"
                      src={getImageUrl(user?.avatarUrl || user?.avatar_url || user?.avatar) || "https://lh3.googleusercontent.com/aida-public/AB6AXuAJo_eCiHEmgpJvhk5_EqIDtHApDD7mQOsztmQH04030D2ZbgjV3pMSRkeW7rZE8rhhQxG2ppeWl7pJvDbppLZn9XLqmJWIaNeminSRoka2zzE9nyCYIlk0ZMLOPrfuWofeM12lXn-HG_pFXCuMeN15SV4ZfZdPNe4Xfmqe4mew_R9OeCshJraJ4_c-9XhdGzjQbzpbQ7mIRzufxncVevVyOF6H9tpRloO6SMq8D6Ol3MKStLwkxTRuVbHmtx1JMFojYkrlH2n7XA"}
                    />
                  </div>
                  <div 
                    onClick={() => document.getElementById("avatar-upload-input").click()}
                    className="absolute inset-0 bg-on-background/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-surface font-bold">edit</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatar-upload-input"
                    onChange={handleAvatarChange}
                  />
                </div>
                
                <div className="text-center md:text-left pt-xs select-none">
                  <h3 className="font-headline-sm text-headline-sm mb-xs font-bold text-on-surface">Ảnh đại diện</h3>
                  <p className="text-on-surface-variant font-body-md mb-sm">Tải lên ảnh mới. Định dạng PNG, JPG hoặc GIF.</p>
                  <div className="flex gap-sm justify-center md:justify-start">
                    <button 
                      type="button"
                      onClick={() => document.getElementById("avatar-upload-input").click()}
                      className="px-5 py-2 rounded-full border border-outline text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold shadow-sm"
                    >
                      Thay đổi
                    </button>
                    <button 
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-5 py-2 rounded-full text-error hover:bg-error-container/10 transition-colors font-label-md text-label-md font-bold"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSave} className="space-y-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Full Name */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant px-xs font-bold">Họ và tên</label>
                    <input
                      className="w-full bg-white border border-outline-variant/30 rounded-lg px-md py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant px-xs font-bold">Email</label>
                    <input
                      className="w-full bg-white border border-outline-variant/30 rounded-lg px-md py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {/* Bio */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant px-xs font-bold">Giới thiệu bản thân</label>
                  <textarea
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-md py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-on-surface leading-relaxed"
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {/* Phone */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant px-xs font-bold">Số điện thoại</label>
                    <input
                      className="w-full bg-white border border-outline-variant/30 rounded-lg px-md py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  {/* Food Preferences */}
                  <div className="flex flex-col gap-xs select-none">
                    <label className="font-label-md text-label-md text-on-surface-variant px-xs font-bold">Sở thích ẩm thực</label>
                    <div className="flex flex-wrap gap-xs py-xs">
                      {["Món Việt", "Baking", "Eat Clean"].map((pref) => (
                        <span key={pref} className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-bold">
                          {pref}
                        </span>
                      ))}
                      <button type="button" className="px-3 py-1 rounded-full border border-dashed border-outline-variant text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 hover:bg-surface-container transition-all font-bold">
                        <span className="material-symbols-outlined text-[14px]">add</span>Thêm
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-md select-none">
                  <h4 className="font-label-md text-label-md text-on-surface-variant mb-sm uppercase tracking-wider font-bold">Mạng xã hội</h4>
                  <div className="space-y-sm">
                    <div className="flex items-center gap-sm">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-secondary">
                        <span className="material-symbols-outlined">link</span>
                      </div>
                      <input
                        className="flex-1 bg-white border border-outline-variant/30 rounded-lg px-md py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface"
                        placeholder="Facebook profile URL"
                        type="text"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-sm">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-secondary">
                        <span className="material-symbols-outlined">photo_camera</span>
                      </div>
                      <input
                        className="flex-1 bg-white border border-outline-variant/30 rounded-lg px-md py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-on-surface"
                        placeholder="Instagram username"
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-lg flex items-center justify-end gap-md select-none border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-6 py-2.5 rounded-full text-secondary hover:bg-surface-container-high transition-colors font-label-md text-label-md font-bold"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-full font-label-md text-label-md font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                      saveSuccess ? "bg-tertiary text-white" : "bg-primary text-white hover:bg-primary/90 active:scale-95"
                    }`}
                  >
                    {loading ? (
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    ) : saveSuccess ? (
                      "Đã lưu!"
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
