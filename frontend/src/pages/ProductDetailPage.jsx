import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductByIdApi, searchProductsApi } from "../services/productApi";
import { logoutAccount } from "../store/authSlice";

const formatCurrency = (value) => {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAccount());
    navigate("/login");
  };

  useEffect(() => {
    let active = true;

    const fetchProductDetails = async () => {
      setLoading(true);
      setError("");
      setActiveImageIndex(0);
      setQuantity(1);

      try {
        const response = await getProductByIdApi(id);
        if (!active) return;
        
        if (response?.success && response?.data) {
          setProduct(response.data);
          
          // Fetch similar products based on category
          if (response.data.category) {
            fetchSimilar(response.data.category, response.data.id);
          }
        } else {
          setError("Không tìm thấy thông tin sản phẩm.");
        }
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Không thể tải thông tin chi tiết món ăn lúc này.");
      } finally {
        if (active) setLoading(false);
      }
    };

    const fetchSimilar = async (categoryName, currentId) => {
      setSimilarLoading(true);
      try {
        const response = await searchProductsApi({
          category: categoryName,
          limit: 5,
        });
        if (!active) return;
        if (response?.data) {
          // Filter out current product
          const filtered = response.data.filter((item) => item.id !== currentId);
          setSimilarProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Lỗi lấy sản phẩm tương tự:", err);
      } finally {
        if (active) setSimilarLoading(false);
      }
    };

    fetchProductDetails();

    return () => {
      active = false;
    };
  }, [id]);

  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setActiveImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setActiveImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleQtyDecrease = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleQtyIncrease = () => {
    if (!product) return;
    setQuantity((prev) => {
      if (product.stock > 0 && prev >= product.stock) {
        return product.stock;
      }
      return prev + 1;
    });
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    alert(`Đã thêm ${quantity} phần "${product.name}" vào giỏ hàng thành công!`);
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    alert(`Mua ngay ${quantity} phần "${product.name}". Chuyển hướng thanh toán...`);
  };

  const images = product?.images?.length 
    ? product.images 
    : ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c"];

  const tags = product?.tags || [];

  return (
    <div className="min-h-screen bg-[#0d0b0c] text-[#f3f4f6]">
      <header className="relative overflow-hidden border-b border-[#1f1b1c]">
        {/* Decorative Gradients */}
        <div className="pointer-events-none absolute -left-24 top-[-140px] h-[340px] w-[340px] rounded-full bg-[#f59e0b]/15 blur-[130px]" />
        <div className="pointer-events-none absolute right-[-90px] top-[140px] h-[300px] w-[300px] rounded-full bg-[#c2410c]/15 blur-[140px]" />

        {/* Top Mini Bar */}
        <div className="border-b border-[#1f1b1c] bg-[#141217]/90">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-xs text-[#cbd5e1]/70 lg:px-10">
            <span className="rounded-full bg-[#1b1410] px-3 py-1 font-semibold text-[#f59e0b]">
              Giao hàng tận nơi · Đảm bảo tươi ngon
            </span>
            <Link to="/" className="hover:text-[#f59e0b] transition">
              ← Trở về Trang chủ
            </Link>
          </div>
        </div>

        {/* Navbar */}
        <div className="relative mx-auto max-w-6xl px-6 py-6 lg:px-10">
          <nav className="flex flex-wrap items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f59e0b] text-[#111111]">
                <span className="font-display text-lg font-bold">NM</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">
                  NutriMeal
                </p>
                <p className="font-display text-base font-semibold">
                  Nấu thông minh, ăn lành mạnh
                </p>
              </div>
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#e5e7eb]">
              <Link className="transition hover:text-[#f59e0b]" to="/">
                Công thức
              </Link>
              <Link className="transition hover:text-[#f59e0b]" to="/search">
                Tìm kiếm / Bộ lọc
              </Link>
              {user ? (
                <>
                  <Link className="transition hover:text-[#f59e0b] border-l border-[#2a2326] pl-3 text-[#f59e0b]" to="/profile">
                    Hồ sơ ({user.fullName || user.full_name || user.username})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full bg-[#1b1410] border border-red-500/30 px-3 py-1.5 text-xs text-red-400 font-semibold shadow-float transition hover:-translate-y-0.5 hover:bg-red-500 hover:text-white"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link className="transition hover:text-[#f59e0b]" to="/login">
                    Đăng nhập
                  </Link>
                  <Link
                    className="rounded-full bg-[#f59e0b] px-4 py-2 text-xs text-[#111111] shadow-float transition hover:-translate-y-0.5 hover:bg-[#fbbf24]"
                    to="/register"
                  >
                    Tạo tài khoản
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-[#2a2326] bg-[#141217] p-8 text-center shadow-float">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f59e0b] border-t-transparent" />
            <p className="mt-4 text-sm text-[#cbd5e1]/70">Đang tải chi tiết món ngon...</p>
          </div>
        ) : error ? (
          <div className="min-h-[400px] rounded-3xl border border-red-500/20 bg-red-500/5 p-12 text-center shadow-float backdrop-blur">
            <span className="text-4xl">⚠️</span>
            <h2 className="mt-4 text-2xl font-bold text-red-400">Có lỗi xảy ra</h2>
            <p className="mt-2 text-sm text-[#cbd5e1]/80">{error}</p>
            <div className="mt-6 flex justify-center gap-4">
              <Link to="/search" className="rounded-2xl bg-[#f59e0b] px-6 py-2.5 text-sm font-semibold text-[#111111] transition hover:bg-[#fbbf24]">
                Tìm món khác
              </Link>
              <Link to="/" className="rounded-2xl border border-[#3a2e32] px-6 py-2.5 text-sm font-semibold transition hover:border-[#cbd5e1]/50">
                Về Trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Navigation Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#cbd5e1]/60">
              <Link to="/" className="hover:text-[#f59e0b] transition">NutriMeal</Link>
              <span>/</span>
              <Link to="/search" className="hover:text-[#f59e0b] transition">Món ăn</Link>
              <span>/</span>
              <span className="text-[#f59e0b]">{product.category}</span>
              <span>/</span>
              <span className="text-[#cbd5e1]/80">{product.name}</span>
            </div>

            {/* Product Detail Top Block */}
            <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              
              {/* Left Column: Image Slider with thumbnails */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#2a2326] bg-[#141217] shadow-float">
                  <img
                    src={images[activeImageIndex]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-all duration-300"
                  />

                  {/* Hot Badges */}
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                    {product.isPromo ? (
                      <span className="rounded-full bg-[#f59e0b] px-3 py-1 text-[#111111] shadow-md">
                        Khuyến mãi
                      </span>
                    ) : null}
                    {product.isNew ? (
                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-white shadow-md">
                        Món mới
                      </span>
                    ) : null}
                    {product.isBestSeller ? (
                      <span className="rounded-full bg-indigo-600 px-3 py-1 text-white shadow-md">
                        Bán chạy nhất
                      </span>
                    ) : null}
                  </div>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#3a2e32]/40 bg-[#141217]/80 text-[#cbd5e1] hover:bg-[#f59e0b] hover:text-[#111111] transition"
                        title="Hình trước"
                      >
                        ‹
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#3a2e32]/40 bg-[#141217]/80 text-[#cbd5e1] hover:bg-[#f59e0b] hover:text-[#111111] transition"
                        title="Hình kế"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails Swiper Row */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl border transition ${
                          activeImageIndex === idx
                            ? "border-[#f59e0b] ring-2 ring-[#f59e0b]/20"
                            : "border-[#2a2326] hover:border-[#cbd5e1]/40"
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details & Actions */}
              <div className="rounded-3xl border border-[#2a2326] bg-[#141217]/95 p-8 shadow-float backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2326] pb-5">
                  <div>
                    <span className="rounded-full bg-[#1b1410] px-3 py-1 text-xs font-semibold text-[#f59e0b]">
                      {product.category}
                    </span>
                    <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-[#f3f4f6]">
                      {product.name}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl bg-[#1b181f] px-3 py-1.5 text-xs text-[#f59e0b]">
                    <span className="text-sm">★</span>
                    <span className="font-bold text-[#e5e7eb]">{Number(product.rating || 0).toFixed(1)}</span>
                    <span className="text-[#cbd5e1]/60">/ 5.0</span>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Pricing Block */}
                  <div className="flex items-baseline gap-4">
                    <p className="text-3xl font-bold text-[#f59e0b]">
                      {formatCurrency(product.price)}
                    </p>
                    {product.isPromo && (
                      <p className="text-sm text-[#cbd5e1]/50 line-through">
                        {formatCurrency(product.price * 1.2)}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#cbd5e1]/80 leading-relaxed">
                    {product.description || "Chưa có mô tả chi tiết cho món ăn này. Chúng tôi luôn lựa chọn nguồn nguyên liệu tươi xanh sạch đạt chứng nhận dinh dưỡng cao cấp nhất."}
                  </p>

                  {/* Stock and Sales stats */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#2a2326] bg-[#1b181f] px-4 py-3 text-xs text-[#cbd5e1]/70">
                      <p className="uppercase tracking-[0.2em] text-[#cbd5e1]/40">Đã bán được</p>
                      <p className="mt-1.5 text-base font-semibold text-[#f3f4f6]">{product.sold || 0} phần ăn</p>
                    </div>
                    <div className="rounded-2xl border border-[#2a2326] bg-[#1b181f] px-4 py-3 text-xs text-[#cbd5e1]/70">
                      <p className="uppercase tracking-[0.2em] text-[#cbd5e1]/40">Tình trạng tồn kho</p>
                      {product.stock > 0 ? (
                        <p className="mt-1.5 text-base font-semibold text-emerald-400">
                          Còn {product.stock} phần ăn
                        </p>
                      ) : (
                        <p className="mt-1.5 text-base font-semibold text-red-500">
                          Tạm hết hàng
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-[#cbd5e1]/50 uppercase tracking-widest mr-1">Thẻ:</span>
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#1b181f] border border-[#2a2326] px-3 py-1 text-xs text-[#cbd5e1]/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quantity & Actions Area */}
                  {product.stock > 0 ? (
                    <div className="space-y-4 pt-4 border-t border-[#2a2326]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#cbd5e1]/85">Chọn số lượng:</span>
                        <div className="flex items-center rounded-2xl border border-[#3a2e32] bg-[#1b181f] p-1">
                          <button
                            type="button"
                            onClick={handleQtyDecrease}
                            disabled={quantity <= 1}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#141217] text-base hover:bg-[#3a2e32] transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="w-12 text-center text-sm font-bold text-[#f3f4f6]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={handleQtyIncrease}
                            disabled={quantity >= product.stock}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#141217] text-base hover:bg-[#3a2e32] transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className="flex-1 rounded-2xl border border-[#f59e0b]/40 bg-[#1b1410] px-5 py-3.5 text-sm font-bold text-[#f59e0b] shadow-sm transition hover:-translate-y-0.5 hover:border-[#f59e0b] hover:bg-[#2a2326]/60"
                        >
                          Thêm giỏ hàng
                        </button>
                        <button
                          type="button"
                          onClick={handleBuyNow}
                          className="flex-1 rounded-2xl bg-[#f59e0b] px-5 py-3.5 text-sm font-bold text-[#111111] transition hover:-translate-y-0.5 hover:bg-[#fbbf24]"
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-[#2a2326]">
                      <button
                        disabled
                        className="w-full rounded-2xl bg-[#2a2326] px-5 py-3.5 text-sm font-semibold text-[#cbd5e1]/45 cursor-not-allowed text-center"
                      >
                        Món ăn tạm hết hàng
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Product Details Section (Cooking profile) */}
            <section className="rounded-3xl border border-[#2a2326] bg-[#141217] p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold border-b border-[#2a2326] pb-3 text-[#f59e0b]">
                Hồ Sơ Dinh Dưỡng & Cách Thưởng Thức
              </h3>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-[#1b181f] p-4 text-center">
                  <span className="text-xl">⏱️</span>
                  <h4 className="mt-2 text-xs uppercase tracking-wider text-[#cbd5e1]/50">Thời gian nấu</h4>
                  <p className="mt-1 font-semibold text-[#f3f4f6]">15 - 30 phút</p>
                </div>
                <div className="rounded-2xl bg-[#1b181f] p-4 text-center">
                  <span className="text-xl">🌶️</span>
                  <h4 className="mt-2 text-xs uppercase tracking-wider text-[#cbd5e1]/50">Độ cay</h4>
                  <p className="mt-1 font-semibold text-[#f3f4f6]">Không cay hoặc cay nhẹ</p>
                </div>
                <div className="rounded-2xl bg-[#1b181f] p-4 text-center">
                  <span className="text-xl">🥗</span>
                  <h4 className="mt-2 text-xs uppercase tracking-wider text-[#cbd5e1]/50">Chất lượng</h4>
                  <p className="mt-1 font-semibold text-[#f3f4f6]">Nguyên liệu sạch 100%</p>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-[#cbd5e1]/85">
                <p>
                  <strong>NutriMeal Cam kết:</strong> Tất cả sản phẩm thuộc hệ thống của chúng tôi đều tuân thủ nghiêm ngặt quy trình vệ sinh an toàn thực phẩm. Món ăn <strong>{product.name}</strong> được chế biến trong ngày bởi đội ngũ đầu bếp chuyên nghiệp, giữ nguyên hương vị đặc trưng, béo ngậy mà không làm mất chất dinh dưỡng có lợi.
                </p>
                <p>
                  <strong>Gợi ý cách dùng:</strong> Dùng ngay khi còn nóng để cảm nhận vị thịt mềm ngọt cùng nước dùng đậm đà nhất. Thích hợp ăn kèm cùng xà lách sạch và rau thơm các loại.
                </p>
              </div>
            </section>

            {/* Similar Products Section */}
            <section className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#cbd5e1]/60">Gợi ý dành cho bạn</p>
                <h3 className="mt-2 font-display text-2xl">Món Ăn Tương Tự</h3>
              </div>

              {similarLoading ? (
                <div className="rounded-3xl border border-dashed border-[#2a2326] bg-[#141217] p-8 text-center text-xs text-[#cbd5e1]/60">
                  Đang tìm các món ăn cùng danh mục...
                </div>
              ) : similarProducts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#2a2326] bg-[#141217] p-8 text-center text-xs text-[#cbd5e1]/60">
                  Không có sản phẩm tương tự cùng danh mục nào khác.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {similarProducts.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="group rounded-3xl border border-[#2a2326] bg-[#141217] p-4 shadow-sm hover:shadow-float transition hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#1b181f]">
                        <img
                          src={item.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-[#cbd5e1]/60">
                        <span>{item.category}</span>
                        <span>{Number(item.rating || 0).toFixed(1)} ★</span>
                      </div>
                      <h4 className="mt-2 font-display text-base font-semibold group-hover:text-[#f59e0b] transition line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#f59e0b]">{formatCurrency(item.price)}</span>
                        <span className="text-[#cbd5e1]/50">Đã bán {item.sold || 0}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-[#1f1b1c] bg-[#141217] mt-16">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-[#cbd5e1]/70 lg:px-10">
          <p>NutriMeal 2026. Xây dựng cho lối sống năng động và lành mạnh.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/" className="font-semibold text-[#f3f4f6]">Trang chủ</Link>
            <Link to="/search">Tìm kiếm</Link>
            <Link to="/profile">Hồ sơ cá nhân</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;
