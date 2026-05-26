import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import { getCategoriesApi } from "../services/categoryApi";
import { searchRecipesApi } from "../services/recipeApi";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(q);
  const [selectedCategories, setSelectedCategories] = useState(cat ? [cat] : []);
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [dbRecipes, setDbRecipes] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cats, recs] = await Promise.all([
          getCategoriesApi(),
          searchRecipesApi({ q })
        ]);
        setDbCategories(cats);
        setDbRecipes(recs);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm công thức:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [q]);

  useEffect(() => {
    setSearchQuery(q);
  }, [q]);

  useEffect(() => {
    if (cat) {
      setSelectedCategories([cat]);
    } else {
      setSelectedCategories([]);
    }
  }, [cat]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery, ...(cat ? { category: cat } : {}) });
    setCurrentPage(1);
  };

  const handleChipClick = (term) => {
    setSearchQuery(term);
    setSearchParams({ q: term });
    setCurrentPage(1);
  };

  // Filter recipes logic
  const filteredRecipes = useMemo(() => {
    return dbRecipes.filter((recipe) => {
      // 1. Text Search (already partially filtered by backend, but we can do extra matching in case of client sync)
      if (q.trim()) {
        const queryLower = q.toLowerCase();
        const titleVal = (recipe.title || "").toLowerCase();
        const descVal = (recipe.description || "").toLowerCase();
        const authorVal = (recipe.author_name || "").toLowerCase();
        const matchesName = titleVal.includes(queryLower);
        const matchesDesc = descVal.includes(queryLower);
        const matchesAuthor = authorVal.includes(queryLower);
        if (!matchesName && !matchesDesc && !matchesAuthor) return false;
      }

      // 2. Categories
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some(catName => 
          recipe.categories && recipe.categories.some(rcat => 
            (typeof rcat === 'string' ? rcat : rcat.name).toLowerCase() === catName.toLowerCase()
          )
        );
        if (!matchesCategory) return false;
      }

      // 3. Prep Time
      if (selectedTimeRange !== "all") {
        const time = (recipe.prep_time_minutes || recipe.prepTimeMinutes || 0) + (recipe.cook_time_minutes || recipe.cookTimeMinutes || 0);
        if (selectedTimeRange === "under15" && time >= 15) return false;
        if (selectedTimeRange === "15to30" && (time < 15 || time > 30)) return false;
        if (selectedTimeRange === "over30" && time <= 30) return false;
      }

      // 4. Difficulty
      if (selectedDifficulty !== "all") {
        const diffMap = {
          "Dễ": "dễ",
          "Vừa": "trung bình",
          "Trung bình": "trung bình",
          "Khó": "khó"
        };
        const mappedDiff = diffMap[selectedDifficulty];
        if ((recipe.difficulty || "").toLowerCase() !== mappedDiff) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") {
        const ratingA = parseFloat(a.rating || a.average_rating || a.averageRating || 0);
        const ratingB = parseFloat(b.rating || b.average_rating || b.averageRating || 0);
        return ratingB - ratingA;
      }
      if (sortBy === "newest") {
        const dateA = new Date(a.created_at || a.createdTime || 0);
        const dateB = new Date(b.created_at || b.createdTime || 0);
        return dateB - dateA;
      }
      return b.id - a.id;
    });
  }, [dbRecipes, q, selectedCategories, selectedTimeRange, selectedDifficulty, sortBy]);

  const totalPages = Math.ceil(filteredRecipes.length / 6);
  const displayedRecipes = filteredRecipes.slice((currentPage - 1) * 6, currentPage * 6);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTimeRange("all");
    setSelectedDifficulty("all");
    setSortBy("newest");
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-surface-container-low py-lg select-none">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-xs mb-md text-label-sm font-label-sm text-on-surface-variant">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Khám phá công thức</span>
          </nav>
          
          <div className="grid md:grid-cols-2 gap-lg items-center">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-md font-bold">
                Tìm cảm hứng cho bữa tối tiếp theo
              </h1>
              <form onSubmit={handleSearchSubmit} className="relative max-w-lg">
                <input
                  className="w-full h-14 pl-12 pr-32 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 rounded-xl font-body-md text-on-surface outline-none"
                  placeholder="Tìm tên món, nguyên liệu, đầu bếp..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  search
                </span>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-md py-2.5 rounded-lg font-label-md hover:opacity-90 transition-all font-bold"
                >
                  Tìm kiếm
                </button>
              </form>
            </div>
            
            <div className="hidden md:block relative h-[300px] rounded-xl overflow-hidden shadow-md">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAffFMQq_0Q67H-vnKJ0E5blK0Rqt6ar7t--bR-Ud9VgGfdCpVu-cORUjZCUVcji-5dNi9kcUiivQoTCM-uqvdSgVeb1TF7keQcy-jcClgSSwQ82LZTWkZjk3YA3PKPSwFmXMgUof_7_3CYQhEFsr0abNyY-SF9hFW81PLwqjViY3pM6mB87X3hMu0rWPGZo_RtG2jrttzdJQe1xou7iTueHBMPjrRSgiaUIABNqq0qqaMUl_8v5X9oidqbHjf_6y4oj-1im_JrvA"
                alt="Table setup"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl flex-grow flex flex-col md:flex-row gap-lg w-full">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 select-none">
          <div className="sticky top-24 space-y-lg">
            {/* Categories */}
            {/* Categories */}
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md font-bold">Danh mục</h3>
              <div className="space-y-sm">
                {loading ? (
                  <p className="text-xs text-on-surface-variant">Đang tải...</p>
                ) : dbCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-sm cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryChange(cat.name)}
                      className="w-5 h-5 border-outline-variant text-primary rounded focus:ring-primary focus:outline-none"
                    />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Prep Time */}
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md font-bold">Thời gian nấu</h3>
              <div className="space-y-sm">
                {[
                  { label: "Tất cả", value: "all" },
                  { label: "Dưới 15 phút", value: "under15" },
                  { label: "15 - 30 phút", value: "15to30" },
                  { label: "Trên 30 phút", value: "over30" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-sm cursor-pointer group">
                    <input
                      type="radio"
                      name="time"
                      checked={selectedTimeRange === option.value}
                      onChange={() => { setSelectedTimeRange(option.value); setCurrentPage(1); }}
                      className="w-5 h-5 border-outline-variant text-primary focus:ring-primary focus:outline-none"
                    />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Difficulty */}
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md font-bold">Độ khó</h3>
              <div className="flex flex-wrap gap-xs">
                {["all", "Dễ", "Vừa", "Khó"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => { setSelectedDifficulty(diff); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full border text-label-md font-label-md transition-all font-bold ${
                      selectedDifficulty === diff
                        ? "border-primary bg-primary-container/10 text-primary"
                        : "border-outline-variant text-secondary hover:bg-secondary-container hover:text-on-secondary-container"
                    }`}
                  >
                    {diff === "all" ? "Tất cả" : diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-2.5 rounded-xl border border-outline text-secondary font-label-md font-bold hover:bg-surface-container-low transition-all active:scale-95"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </aside>

        {/* Main Recipe Grid / Results */}
        <section className="flex-grow">
          {loading ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
              <p className="mt-4 text-on-surface-variant">Đang tải danh sách công thức...</p>
            </div>
          ) : filteredRecipes.length > 0 ? (
            <>
              {/* Header & Sort */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
                <p className="font-body-md text-on-surface-variant">
                  Hiển thị <span className="font-bold text-on-surface">{filteredRecipes.length} công thức</span> phù hợp
                </p>
                <div className="flex items-center gap-sm select-none">
                  <span className="font-label-md text-label-md text-on-surface-variant">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface py-2 pr-10 pl-3 focus:ring-primary focus:border-primary focus:outline-none"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="rating">Đánh giá cao</option>
                  </select>
                </div>
              </div>
              
              {/* Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-xl flex justify-center items-center gap-sm select-none">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-md font-bold ${
                        currentPage === p
                          ? "bg-primary text-on-primary"
                          : "text-on-surface-variant hover:bg-surface-variant"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State Search Section */
            <div className="w-full flex flex-col items-center text-center select-none py-lg animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-primary text-3xl font-bold">search_off</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-sm leading-tight font-bold">
                Không tìm thấy công thức nào phù hợp
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-md">
                Thử điều chỉnh lại từ khóa hoặc sử dụng các gợi ý bên dưới để tìm món ăn khác nhé!
              </p>
              
              <div className="flex flex-wrap justify-center gap-sm mb-xl">
                {["Bún chả", "Chay", "Tráng miệng"].map((chip) => (
                  <span
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="px-md py-2 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full font-label-md text-label-md border border-outline-variant cursor-pointer hover:bg-tertiary-fixed-dim transition-colors font-bold shadow-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              
              {/* Suggested Recipes Grid */}
              <div className="w-full border-t border-outline-variant/10 pt-xl">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg font-bold">Có thể bạn quan tâm</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md max-w-3xl mx-auto text-left">
                  {dbRecipes.slice(0, 2).map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
