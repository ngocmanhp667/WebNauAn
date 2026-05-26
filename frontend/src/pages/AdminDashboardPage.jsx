import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const AdminDashboardPage = () => {
  const [pendingRecipes, setPendingRecipes] = useState([
    {
      id: 1,
      name: "Salad Bơ Nhiệt Đới",
      author: "Nguyễn Văn A",
      date: "12/05/2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnssvSnTpsCDOk2vdtwf40Y0EGuFdgQmje6pZJUWsyoz43XFGSZY8MIo_znMsjm9Ueiu5hrXIKLm8Aefpv_axOG_X_ugor49Vv-h7zNaUg4QGEZPgdueGviNAxqqL-Eu0JgsOsHFmGR6r3gP-LjTi_85HMMgKZVBR5cDEQZ8QqzcDqK0QCvMbujSoGVLVBoIfJKu9EeNB8_eOUqSgtR6j_4G1gWNli-_reE63pPAz3dtVBmyq3EnQfFxt2wNbLB7mJ3gQPB0baHQ"
    },
    {
      id: 2,
      name: "Pasta Sốt Cà Ri Thái",
      author: "Trần Thị B",
      date: "11/05/2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCb9w60d5UTOFL3DTGw38Ugh4r1zZ9jJ3hsBoQ7ZLs6QIgM8EVuxHcFRbGtfMsKuGn0viCBjoNEqFU5pe6rnpQuacLb2OvaMKNNCTpMEGw9dqK3puiDFo8N_m_nFHZZNsmFnRENBi-g4ppwM8y2Nx4eCCP4PQq9uDvfIpVI8Qpf9jR63CYE0M8EfC5u8eowSYHcl7f8bxI1pVPE_NT5lo0nA78fAysi_G0dOtrvwBRR3PaXuLsOvMLoQ6XBONLNYG6YG4eqLo8VQQ"
    },
    {
      id: 3,
      name: "Bít Tết Sốt Tiêu Xanh",
      author: "Lê Văn C",
      date: "10/05/2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSD65AQagxaQX3U20si0aMqdBjaUIRIROYDE3bjNOuKcwUWtN6cSeBQSzTV9QN5uZO9DUWJ3i8HIqu12hIPLm39xQTZ23AxzACwAl4Jdcpm0EzFXuGec7amKCnNdec3qu8oJ9XhIBBANUnGhv13l-uxN13sPO9dTOaXQDYyj9STr4GLG0jcY5EAek-WSEnNn7DyWK9Nz60ZNAHWVZbvAq4V8ArNwHkat4BTou_BE4IVRoiQeXeqNJqj1Tv5fCgwZPjS96S_cs-iQ"
    }
  ]);

  const handleApprove = (id) => {
    setPendingRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const handleReject = (id) => {
    setPendingRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Container */}
      <div className="ml-64 flex-grow flex flex-col min-h-screen">
        {/* Header */}
        <AdminHeader />
        
        {/* Content Padding Area */}
        <main className="p-gutter max-w-max-width mx-auto w-full flex-grow">
          {/* Statistics Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg select-none">
            {/* Stat 1 */}
            <div className="bg-surface-container-lowest p-md rounded-xl recipe-card-shadow flex items-center justify-between border-l-4 border-primary border-t border-r border-b border-outline-variant/15">
              <div>
                <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider mb-xs font-bold">Tổng Người Dùng</p>
                <p className="font-headline-md text-headline-md text-on-surface font-bold">12,482</p>
                <p className="text-tertiary font-label-sm text-label-sm mt-xs flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +12% so với tháng trước
                </p>
              </div>
              <div className="bg-primary-fixed p-sm rounded-full text-primary shadow-inner">
                <span className="material-symbols-outlined text-3xl font-bold">group</span>
              </div>
            </div>
            
            {/* Stat 2 */}
            <div className="bg-surface-container-lowest p-md rounded-xl recipe-card-shadow flex items-center justify-between border-l-4 border-tertiary border-t border-r border-b border-outline-variant/15">
              <div>
                <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider mb-xs font-bold">Tổng Công Thức</p>
                <p className="font-headline-md text-headline-md text-on-surface font-bold">8,950</p>
                <p className="text-tertiary font-label-sm text-label-sm mt-xs flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +5.4% so với tháng trước
                </p>
              </div>
              <div className="bg-tertiary-fixed p-sm rounded-full text-tertiary shadow-inner">
                <span className="material-symbols-outlined text-3xl font-bold">restaurant</span>
              </div>
            </div>
            
            {/* Stat 3 */}
            <div className="bg-surface-container-lowest p-md rounded-xl recipe-card-shadow flex items-center justify-between border-l-4 border-error border-t border-r border-b border-outline-variant/15">
              <div>
                <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider mb-xs font-bold">Chờ Duyệt</p>
                <p className="font-headline-md text-headline-md text-on-surface font-bold">{pendingRecipes.length + 121}</p>
                <p className="text-error font-label-sm text-label-sm mt-xs font-bold">Cần xử lý gấp</p>
              </div>
              <div className="bg-error-container p-sm rounded-full text-error shadow-inner">
                <span className="material-symbols-outlined text-3xl font-bold">pending_actions</span>
              </div>
            </div>
          </section>

          {/* Table Section: Công thức chờ duyệt */}
          <section className="bg-surface-container-lowest rounded-xl shadow-soft overflow-hidden border border-outline-variant/10">
            <div className="p-md border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-sm select-none">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Công thức chờ duyệt</h2>
              <div className="flex gap-sm w-full md:w-auto">
                <button className="flex items-center gap-xs px-4 py-2 bg-surface-container-high rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  Bộ lọc
                </button>
                <button className="flex items-center gap-xs px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all font-bold shadow-sm">
                  Xuất báo cáo
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {pendingRecipes.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-variant text-on-surface-variant select-none border-b border-outline-variant/20">
                      <th className="px-md py-4 font-label-md text-label-md uppercase font-bold">Tên món</th>
                      <th className="px-md py-4 font-label-md text-label-md uppercase font-bold">Tác giả</th>
                      <th className="px-md py-4 font-label-md text-label-md uppercase font-bold">Ngày đăng</th>
                      <th className="px-md py-4 font-label-md text-label-md uppercase font-bold">Trạng thái</th>
                      <th className="px-md py-4 font-label-md text-label-md uppercase text-right font-bold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {pendingRecipes.map((recipe) => (
                      <tr key={recipe.id} className="hover:bg-surface-bright transition-colors group animate-in fade-in duration-300">
                        <td className="px-md py-4">
                          <div className="flex items-center gap-sm">
                            <img
                              alt={recipe.name}
                              className="w-12 h-12 rounded-lg object-cover border border-outline-variant/10 shadow-sm"
                              src={recipe.image}
                            />
                            <span className="font-label-md text-label-md text-on-surface font-bold group-hover:text-primary transition-colors">
                              {recipe.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-md py-4 text-body-md text-on-surface-variant">{recipe.author}</td>
                        <td className="px-md py-4 text-body-md text-on-surface-variant">{recipe.date}</td>
                        <td className="px-md py-4">
                          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-sm font-bold shadow-sm select-none">
                            Đang chờ
                          </span>
                        </td>
                        <td className="px-md py-4 text-right">
                          <div className="flex justify-end gap-sm select-none">
                            <button
                              onClick={() => handleApprove(recipe.id)}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-tertiary-fixed text-tertiary hover:scale-110 active:scale-95 transition-all shadow-sm"
                            >
                              <span className="material-symbols-outlined font-bold">check</span>
                            </button>
                            <button
                              onClick={() => handleReject(recipe.id)}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-error-container text-error hover:scale-110 active:scale-95 transition-all shadow-sm"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-on-surface-variant font-bold">
                  Không còn công thức nào đang chờ duyệt!
                </div>
              )}
            </div>
            
            <div className="p-md bg-surface-container border-t border-outline-variant/10 flex justify-between items-center select-none">
              <p className="text-label-sm text-on-surface-variant">Hiển thị {pendingRecipes.length} mục</p>
              <div className="flex items-center gap-xs">
                <button className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-full text-label-sm font-bold">1</button>
                <button className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="w-full py-xl border-t border-outline-variant/20 bg-surface-container-highest select-none mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop w-full max-w-max-width mx-auto gap-md">
            <div className="flex flex-col items-center md:items-start">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">CulinShare</span>
              <p className="font-body-md text-body-md text-on-surface-variant">© {new Date().getFullYear()} CulinShare. Crafted for home chefs.</p>
            </div>
            <div className="flex gap-lg">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">About</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Privacy</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Terms</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Help</a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
