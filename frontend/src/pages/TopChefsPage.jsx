import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getChefsRankingApi } from "../services/recipeApi";
import { getImageUrl } from "../services/api";

const TopChefsPage = () => {
  const [chefs, setChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("likes"); // "likes" or "followers"

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setIsLoading(true);
        const data = await getChefsRankingApi();
        setChefs(data || []);
      } catch (err) {
        console.error("Lỗi khi tải bảng xếp hạng đầu bếp:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRanking();
  }, []);

  // Sắp xếp đầu bếp theo tiêu chí
  const sortedChefs = [...chefs].sort((a, b) => {
    if (activeTab === "likes") {
      return b.likes_count - a.likes_count || b.followers_count - a.followers_count;
    } else {
      return b.followers_count - a.followers_count || b.likes_count - a.likes_count;
    }
  });

  // Chia làm Top 3 (Vinh danh Podium) và danh sách còn lại
  const top3 = sortedChefs.slice(0, 3);
  
  // Sắp xếp lại thứ tự Top 3 để vẽ Podium đẹp: [Hạng 2, Hạng 1, Hạng 3]
  const podiumChefs = [];
  if (top3[1]) podiumChefs.push({ ...top3[1], rank: 2 });
  if (top3[0]) podiumChefs.push({ ...top3[0], rank: 1 });
  if (top3[2]) podiumChefs.push({ ...top3[2], rank: 3 });

  const remainingChefs = sortedChefs.slice(3);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      <Header />

      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl flex-grow w-full">
        {/* Page Title Section */}
        <section className="text-center max-w-2xl mx-auto mb-xl">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Danh Vọng Bếp Việt</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background font-bold mt-3 leading-tight">
            Đầu Bếp Nổi Bật
          </h1>
          <p className="text-on-surface-variant font-body-md mt-4 leading-relaxed">
            Vinh danh những đầu bếp tài hoa và nhà sáng tạo ẩm thực xuất sắc nhất với những đóng góp tuyệt vời cho cộng đồng CulinShare.
          </p>
        </section>

        {/* Tab Switcher - Styled premiumly with sliding capsule look */}
        <div className="flex justify-center mb-12">
          <div className="bg-surface-container-low p-1.5 rounded-full border border-outline-variant/30 flex gap-2 shadow-inner">
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-label-md font-bold transition-all duration-300 ${
                activeTab === "likes"
                  ? "bg-primary text-on-primary shadow-md transform scale-105"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              Được yêu thích nhất
            </button>
            <button
              onClick={() => setActiveTab("followers")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-label-md font-bold transition-all duration-300 ${
                activeTab === "followers"
                  ? "bg-primary text-on-primary shadow-md transform scale-105"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">person_check</span>
              Quan tâm nhiều nhất
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
            <p className="text-on-surface-variant font-bold">Đang tải bảng xếp hạng đầu bếp...</p>
          </div>
        ) : chefs.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">workspace_premium</span>
            <p className="text-on-surface-variant font-bold mt-4">Chưa có bảng xếp hạng đầu bếp.</p>
          </div>
        ) : (
          <>
            {/* 🏆 Section 1: Top 3 Podium (Bục vinh danh) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto mb-16 select-none">
              {podiumChefs.map((chef) => {
                const isRank1 = chef.rank === 1;
                const isRank2 = chef.rank === 2;
                const medalBg = isRank1 ? "bg-amber-400" : isRank2 ? "bg-slate-300" : "bg-amber-600";
                const medalIcon = isRank1 ? "🏆" : isRank2 ? "🥈" : "🥉";
                
                return (
                  <div
                    key={chef.id}
                    className={`flex flex-col items-center relative transition-all duration-500 hover:-translate-y-2 ${
                      isRank1 ? "order-1 md:order-2 md:mb-6" : isRank2 ? "order-2 md:order-1" : "order-3"
                    }`}
                  >
                    {/* Chef Card */}
                    <div 
                      className={`w-full bg-surface-container-lowest border rounded-3xl p-6 text-center shadow-md flex flex-col items-center ${
                        isRank1 
                          ? "border-amber-400/50 shadow-amber-400/10 ring-2 ring-amber-400/20" 
                          : "border-outline-variant/30"
                      }`}
                    >
                      {/* Rank Tag */}
                      <div className={`absolute -top-4 w-10 h-10 ${medalBg} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md border-2 border-white`}>
                        {chef.rank}
                      </div>

                      {/* Avatar */}
                      <Link to={`/chef/${chef.id}`} className="relative mt-2 block">
                        <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${isRank1 ? "border-amber-400" : "border-outline-variant"} shadow-inner`}>
                          <img
                            alt={chef.full_name || chef.username}
                            src={getImageUrl(chef.avatar_url) || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white text-md px-1.5 py-0.5 rounded-full shadow-sm border border-outline-variant">
                          {medalIcon}
                        </div>
                      </Link>

                      {/* Name */}
                      <Link to={`/chef/${chef.id}`} className="mt-4 block hover:text-primary transition-colors">
                        <h3 className="font-headline-sm text-headline-sm font-bold truncate max-w-[200px]">
                          {chef.full_name || chef.username}
                        </h3>
                      </Link>
                      
                      <p className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-wider">
                        {chef.role === 'admin' ? 'Chuyên Gia Ẩm Thực' : 'Đầu Bếp Thành Viên'}
                      </p>

                      {/* Bio */}
                      <p className="text-on-surface-variant text-xs mt-3 line-clamp-2 min-h-[32px] px-2">
                        {chef.bio || "Thành viên đam mê ẩm thực Việt."}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-outline-variant/20 text-center">
                        <div>
                          <span className="block font-bold text-sm text-on-background">{chef.recipes_count}</span>
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Bài viết</span>
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-on-background">{chef.likes_count}</span>
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Lượt thích</span>
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-on-background">{chef.followers_count}</span>
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Theo dõi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 📋 Section 2: Remaining Chefs List (Thẻ hàng dọc) */}
            {remainingChefs.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <h2 className="font-headline-md text-headline-md font-bold mb-6 text-on-background pl-2 border-l-4 border-primary">
                  Vị Trí Tiếp Theo
                </h2>
                <div className="space-y-4">
                  {remainingChefs.map((chef, idx) => {
                    const rank = idx + 4;
                    return (
                      <div
                        key={chef.id}
                        className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:border-outline"
                      >
                        {/* Left Info: Rank, Avatar, Name */}
                        <div className="flex items-center gap-4">
                          <span className="w-8 text-center font-bold text-on-surface-variant text-lg">
                            #{rank}
                          </span>
                          
                          <Link to={`/chef/${chef.id}`} className="block">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant">
                              <img
                                alt={chef.full_name || chef.username}
                                src={getImageUrl(chef.avatar_url) || "https://images.unsplash.com/photo-1577219491135-ce391730fb2c"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>

                          <div>
                            <Link to={`/chef/${chef.id}`} className="hover:text-primary transition-colors">
                              <h3 className="font-bold text-on-background text-sm md:text-base">
                                {chef.full_name || chef.username}
                              </h3>
                            </Link>
                            <p className="text-xs text-on-surface-variant line-clamp-1 max-w-[250px] md:max-w-[400px] mt-0.5">
                              {chef.bio || "Thành viên đam mê ẩm thực."}
                            </p>
                          </div>
                        </div>

                        {/* Right Stats: Recipes, Likes, Followers */}
                        <div className="flex gap-4 md:gap-8 items-center text-right text-xs md:text-sm">
                          <div className="hidden sm:block">
                            <span className="block font-bold text-on-background">{chef.recipes_count}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase">Công thức</span>
                          </div>
                          <div>
                            <span className="block font-bold text-on-background">{chef.likes_count}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase">Lượt thích</span>
                          </div>
                          <div>
                            <span className="block font-bold text-on-background">{chef.followers_count}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase">Người theo dõi</span>
                          </div>
                          
                          <Link
                            to={`/chef/${chef.id}`}
                            className="bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary border border-primary/20 hover:border-transparent px-3 py-1.5 rounded-full font-bold text-xs transition-all active:scale-95 ml-2"
                          >
                            Xem hồ sơ
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TopChefsPage;
