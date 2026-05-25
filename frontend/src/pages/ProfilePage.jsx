import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileField from '../components/profile/ProfileField.jsx'
import ProfileNavItem from '../components/profile/ProfileNavItem.jsx'
import ProfileSocialField from '../components/profile/ProfileSocialField.jsx'
import { getProfileApi, updateProfileApi } from '../services/profileApi'

const navigationItems = [
  { label: 'Thông tin cá nhân', icon: 'person', active: true },
  { label: 'Mật khẩu & Bảo mật', icon: 'lock', active: false },
  { label: 'Thông báo', icon: 'notifications', active: false },
  { label: 'Công thức đã lưu', icon: 'bookmark', active: false },
]

const favoriteTags = ['Món Việt', 'Baking', 'Eat Clean']

const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAAymTPLe8qeQ-OwEcpSDE2G4mib3-hcox7DaSoGwyPmr6vm8PzxcEahKcnmjjPCCWrJOsoQ1wXIegv1SSOUMcLzNmrhC9hWfc6TSCqd9aIjv5stvXiaXnweDE1vYrDp4Vhp8OWl5mbf5KR3as40QB4_NeI8-viIMbo46DVesmWlGsmlxmtCAxgAUUFUBMoGgLQN-eVBMKpmCG7WD8qP6rNmq9QXpOFwV9rFSuJr9yHqhp3gejFSKzYAzP2CswbyY3Hh2iyQbE8fw'

const defaultProfile = {
  avatarUrl: defaultAvatar,
  fullName: 'Hoàng Anh',
  email: 'anh.hoang@email.com',
  bio:
    'Chào mọi người, mình là một người yêu bếp núc và muốn chia sẻ những công thức truyền thống Việt Nam đến với cộng đồng. Rất vui được làm quen!',
  phone: '090 123 4567',
  facebookUrl: 'Facebook profile URL',
  instagramUsername: 'Instagram username',
}

const normalizeProfileData = (data) => ({
  avatarUrl: data?.avatarUrl ?? data?.avatar_url ?? defaultProfile.avatarUrl,
  fullName: data?.fullName ?? data?.full_name ?? defaultProfile.fullName,
  email: data?.email ?? defaultProfile.email,
  bio: data?.bio ?? defaultProfile.bio,
  phone: data?.phone ?? defaultProfile.phone,
  facebookUrl: data?.facebookUrl ?? data?.facebook_url ?? defaultProfile.facebookUrl,
  instagramUsername:
    data?.instagramUsername ?? data?.instagram_username ?? defaultProfile.instagramUsername,
})

const ProfilePage = () => {
  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState(defaultProfile)
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar)
  const [avatarName, setAvatarName] = useState('A professional studio portrait')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const avatarPreviewAlt = useMemo(
    () => `${profile.fullName} avatar preview`,
    [profile.fullName],
  )

  useEffect(() => {
    let ignore = false

    const loadProfile = async () => {
      setLoadingProfile(true)
      try {
        const response = await getProfileApi()
        if (ignore) return

        setProfile((current) => ({
          ...current,
          ...normalizeProfileData(response?.data),
        }))
        const nextAvatar = response?.data?.avatarUrl ?? response?.data?.avatar_url
        if (nextAvatar) {
          setAvatarSrc(nextAvatar)
        }
      } catch {
        // Keep local defaults when backend auth/token is unavailable.
      } finally {
        if (!ignore) {
          setLoadingProfile(false)
        }
      }
    }

    loadProfile()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (avatarSrc.startsWith('blob:')) {
        URL.revokeObjectURL(avatarSrc)
      }
    }
  }, [avatarSrc])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const handleChooseAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const nextAvatar = URL.createObjectURL(file)
    setAvatarSrc((current) => {
      if (current.startsWith('blob:')) {
        URL.revokeObjectURL(current)
      }
      return nextAvatar
    })
    setAvatarName(file.name)
  }

  const handleRemoveAvatar = () => {
    setAvatarSrc(defaultAvatar)
    setAvatarName('A professional studio portrait')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const result = await updateProfileApi({
        avatarUrl: avatarSrc.startsWith('blob:') ? undefined : avatarSrc,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        facebookUrl: profile.facebookUrl,
        instagramUsername: profile.instagramUsername,
      })

      const nextData = result?.data ?? result
      if (nextData) {
        setProfile((current) => ({
          ...current,
          ...normalizeProfileData(nextData),
        }))
      }

      setMessage({
        tone: 'success',
        text: result?.message || 'Đã lưu thay đổi vào backend.',
      })
    } catch (error) {
      setMessage({
        tone: 'error',
        text:
          error?.message ||
          'Không thể lưu profile. Hãy kiểm tra token đăng nhập trong localStorage hoặc thử lại sau.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c]">
      <header className="sticky top-0 z-50 border-b border-[#e1bfb7]/40 bg-[#fbf9f8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 md:px-16">
          <Link to="/" className="font-display text-2xl text-[#ab2e10]">
            CulinShare
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link className="text-[14px] font-medium text-[#665e49] transition-colors hover:text-[#ab2e10]" to="/">
              Home
            </Link>
            <Link className="text-[14px] font-medium text-[#665e49] transition-colors hover:text-[#ab2e10]" to="/search">
              Browse
            </Link>
            <Link className="text-[14px] font-medium text-[#665e49] transition-colors hover:text-[#ab2e10]" to="/search">
              Top Chefs
            </Link>
            <Link className="text-[14px] font-medium text-[#665e49] transition-colors hover:text-[#ab2e10]" to="/register">
              Submit Recipe
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" className="rounded-full p-2 text-[#ab2e10] transition active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button type="button" className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#ab2e10] bg-[#f0eded]">
              <img alt="User profile" className="h-full w-full object-cover" src={avatarSrc} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 lg:px-16 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <aside className="w-full min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-2 rounded-2xl bg-transparent">
              {navigationItems.map((item) => (
                <ProfileNavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={item.active}
                />
              ))}

              <div className="pt-8">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/40"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  <span className="font-medium text-sm">Đăng xuất</span>
                </button>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-8">
              <h1 className="font-display text-[32px] leading-10 text-[#1b1c1c] md:text-[48px] md:leading-[56px]">
                Cài đặt hồ sơ
              </h1>
              <p className="mt-2 text-[16px] leading-6 text-[#59413b]">
                Quản lý thông tin công khai và cài đặt tài khoản của bạn.
              </p>
            </div>

            <div className="custom-shadow rounded-[20px] bg-[#ffffff] p-5 transition-shadow sm:p-6 md:p-8 lg:p-10">
              <div className="mb-8 flex flex-col gap-6 border-b border-[#e1bfb7]/30 pb-8 lg:flex-row lg:items-start lg:gap-8">
                <div className="relative group mx-auto h-32 w-32 shrink-0 lg:mx-0">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#eae8e7] bg-[#f0eded]">
                    <img alt="Hoàng Anh Profile" className="h-full w-full object-cover" src={avatarSrc} />
                  </div>
                  <button
                    type="button"
                    onClick={handleChooseAvatar}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-[#1b1c1c]/40 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Chỉnh sửa ảnh đại diện"
                  >
                    <span
                      className="material-symbols-outlined text-[#fbf9f8]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      edit
                    </span>
                  </button>
                </div>

                <div className="pt-1 text-center lg:text-left">
                  <h2 className="font-display text-[24px] leading-8 text-[#1b1c1c] md:text-[32px]">
                    Ảnh đại diện
                  </h2>
                  <p className="mt-2 text-[16px] leading-6 text-[#59413b]">
                    Tải lên ảnh mới. Định dạng PNG, JPG hoặc GIF.
                  </p>
                  <p className="mt-2 text-xs text-[#59413b]/80">{avatarName}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3 lg:justify-start">
                    <button
                      type="button"
                      onClick={handleChooseAvatar}
                      className="rounded-full border border-[#8d716a] px-5 py-2 text-[14px] font-medium text-[#1b1c1c] transition-colors hover:bg-[#eae8e7]"
                    >
                      Thay đổi
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="rounded-full px-5 py-2 text-[14px] font-medium text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/30"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/gif"
                  className="hidden"
                  type="file"
                  onChange={handleAvatarChange}
                />
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ProfileField
                    label="Họ và tên"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleFieldChange}
                  />
                  <ProfileField
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleFieldChange}
                  />
                </div>

                <ProfileField
                  label="Giới thiệu bản thân"
                  name="bio"
                  as="textarea"
                  rows={4}
                  value={profile.bio}
                  onChange={handleFieldChange}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ProfileField
                    label="Số điện thoại"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleFieldChange}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="px-1 text-sm font-medium text-[#59413b]">Sở thích ẩm thực</label>
                    <div className="flex flex-wrap gap-2 rounded-lg border border-[#e1bfb7]/30 bg-white px-4 py-3">
                      {favoriteTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#f3ede3] px-3 py-1 text-sm font-medium text-[#575f41]"
                        >
                          {tag}
                        </span>
                      ))}
                      <button
                        type="button"
                        className="rounded-full border border-dashed border-[#e1bfb7] px-3 py-1 text-sm font-medium text-[#59413b] transition-colors hover:bg-[#fbf9f8]"
                      >
                        + Thêm
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#59413b]">
                    Mạng xã hội
                  </h3>
                  <div className="space-y-3">
                    <ProfileSocialField
                      icon="link"
                      name="facebookUrl"
                      value={profile.facebookUrl}
                      onChange={handleFieldChange}
                      placeholder="Facebook profile URL"
                    />
                    <ProfileSocialField
                      icon="photo_camera"
                      name="instagramUsername"
                      value={profile.instagramUsername}
                      onChange={handleFieldChange}
                      placeholder="Instagram username"
                    />
                  </div>
                </div>

                {message ? (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      message.tone === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-rose-200 bg-rose-50 text-rose-800'
                    }`}
                  >
                    {message.text}
                  </div>
                ) : null}

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="button"
                    className="rounded-full px-6 py-3 text-[14px] font-medium text-[#59413b] transition-colors hover:bg-[#f0eded]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={saving || loadingProfile}
                    className="rounded-full bg-[#ab2e10] px-8 py-3 text-[14px] font-medium text-[#ffffff] shadow-sm transition-all hover:bg-[#cd4727] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-10 bg-[#e4e2e2]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 border-t border-[#e1bfb7]/30 px-4 py-10 md:flex-row md:px-16">
          <div className="font-display text-2xl text-[#ab2e10]">CulinShare</div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-center text-sm text-[#59413b]">
            {['About Us', 'Privacy Policy', 'Terms of Service', 'Help Center', 'Contact'].map((item) => (
              <Link key={item} className="transition-colors hover:text-[#ab2e10] hover:underline" to="/profile">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-sm text-[#1b1c1c]/80">© 2024 CulinShare. Crafted for home chefs.</p>
        </div>
      </footer>
    </div>
  )
}

export default ProfilePage