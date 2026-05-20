import { useEffect, useMemo, useState } from "react";
import { searchProductsApi } from "../services/productApi";

const formatCurrency = (value) => {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const difficultyLabel = {
  "Mon chinh": "Mon chinh",
  "Khai vi": "Khai vi",
  Lau: "Lau",
  "Trang mieng": "Trang mieng",
  "Do uong": "Do uong",
};

const mockProducts = [
  {
    id: 1,
    name: "Com ga nuong mat ong",
    description: "Ga nuong mat ong thom mem, an kem com nong.",
    category: "Mon chinh",
    price: 65000,
    rating: 4.6,
    stock: 25,
    sold: 180,
    isPromo: true,
    isNew: false,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
      "https://images.unsplash.com/photo-1525755662778-989d0524087e",
    ],
    tags: ["ga", "nuong", "mon chinh"],
  },
  {
    id: 2,
    name: "Bun bo Hue",
    description: "Nuoc dung dam da, thit bo mem, sa ot cay nhe.",
    category: "Mon chinh",
    price: 55000,
    rating: 4.4,
    stock: 40,
    sold: 140,
    isPromo: false,
    isNew: true,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1604908554025-e4775d24af9e",
      "https://images.unsplash.com/photo-1543353071-873f17a7a088",
    ],
    tags: ["bun", "bo", "cay nhe"],
  },
  {
    id: 3,
    name: "Lau nam hai san",
    description: "Nuoc lau thanh ngot, nhieu nam tuoi va hai san.",
    category: "Lau",
    price: 189000,
    rating: 4.7,
    stock: 10,
    sold: 75,
    isPromo: true,
    isNew: false,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    ],
    tags: ["lau", "hai san", "nam"],
  },
  {
    id: 4,
    name: "Goi cuon tom thit",
    description: "Goi cuon thanh mat, cham nuoc mam chua ngot.",
    category: "Khai vi",
    price: 35000,
    rating: 4.2,
    stock: 60,
    sold: 210,
    isPromo: false,
    isNew: true,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    ],
    tags: ["goi cuon", "tom", "khai vi"],
  },
  {
    id: 5,
    name: "Che dua nong",
    description: "Che dua beo, thom, an nong am bung.",
    category: "Trang mieng",
    price: 25000,
    rating: 4.0,
    stock: 35,
    sold: 95,
    isPromo: false,
    isNew: false,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1505253216365-0fbc1f4c2e7b",
      "https://images.unsplash.com/photo-1481391032119-d89fee407e44",
    ],
    tags: ["che", "dua", "ngot"],
  },
  {
    id: 6,
    name: "Tra dao cam sa",
    description: "Tra thanh mat, vi chua ngot de uong.",
    category: "Do uong",
    price: 28000,
    rating: 4.3,
    stock: 80,
    sold: 260,
    isPromo: true,
    isNew: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735",
      "https://images.unsplash.com/photo-1497534446932-c925b458314e",
    ],
    tags: ["tra", "dao", "do uong"],
  },
];

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(null);
  const [minRating, setMinRating] = useState("all");
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [products, setProducts] = useState([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await searchProductsApi();
        if (!active) return;
        const data = response?.data || [];
        const fallback = data.length ? data : mockProducts;
        setProducts(fallback);

        const maxPriceFound = fallback.reduce(
          (maxValue, item) => Math.max(maxValue, Number(item.price) || 0),
          0,
        );
        setMaxPriceLimit(maxPriceFound);
        setMaxPrice(maxPriceFound);
        setInitialized(true);
      } catch (err) {
        if (!active) return;
        setProducts(mockProducts);
        const maxPriceFound = mockProducts.reduce(
          (maxValue, item) => Math.max(maxValue, Number(item.price) || 0),
          0,
        );
        setMaxPriceLimit(maxPriceFound);
        setMaxPrice(maxPriceFound);
        setInitialized(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!initialized) return undefined;

    let active = true;
    const handle = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await searchProductsApi({
          query,
          category,
          maxPrice,
          minRating: minRating === "all" ? undefined : Number(minRating),
          inStock,
          sort: sortBy,
        });
        if (!active) return;
        const data = response?.data || [];
        setProducts(data.length ? data : mockProducts);
      } catch (err) {
        if (!active) return;
        setProducts(mockProducts);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [category, inStock, initialized, maxPrice, minRating, query, sortBy]);

  const activeFilters = useMemo(() => {
    const filters = [];
    if (query.trim()) filters.push(`Tu khoa: ${query.trim()}`);
    if (category !== "all") filters.push(`Danh muc: ${category}`);
    if (Number.isFinite(maxPrice) && maxPrice < maxPriceLimit) {
      filters.push(`Gia toi da: ${formatCurrency(maxPrice)}`);
    }
    if (minRating !== "all") filters.push(`Danh gia tu: ${minRating}+`);
    if (inStock) filters.push("Con hang");
    return filters;
  }, [category, inStock, maxPrice, maxPriceLimit, minRating, query]);

  const handleReset = () => {
    setQuery("");
    setCategory("all");
    setMaxPrice(maxPriceLimit);
    setMinRating("all");
    setInStock(false);
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-clay-50 text-ink-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-[-120px] h-[360px] w-[360px] rounded-full bg-sunset-400/25 blur-[90px]" />
        <div className="pointer-events-none absolute -right-40 top-[110px] h-[420px] w-[420px] rounded-full bg-sea-600/20 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[-160px] left-[20%] h-[360px] w-[360px] rounded-full bg-amber-200/70 blur-[120px]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:px-10">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-700/60">
                  MamNgon Market
                </p>
                <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                  Tim kiem mon an
                </h1>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-ink-700 shadow-float backdrop-blur">
                Tong mon: <span className="font-semibold">{products.length}</span>
              </div>
            </div>
            <p className="max-w-2xl text-sm text-ink-700/75">
              Loc mon an theo tu khoa, danh muc, gia tien va danh gia. Co the ket
              hop nhieu dieu kien de tim nhanh mon phu hop nhat.
            </p>
          </header>

          <section className="grid gap-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-float backdrop-blur lg:grid-cols-[1.3fr_1fr_0.7fr]">
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-[0.3em] text-ink-700/60">
                Tu khoa
              </label>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Com ga, bun bo, che..."
                className="w-full rounded-2xl border border-clay-200 bg-white/80 px-4 py-3 text-sm text-ink-900 shadow-sm focus:border-sea-600 focus:outline-none focus:ring-2 focus:ring-sea-600/30"
              />
              <div className="flex flex-wrap gap-2 text-xs text-ink-700/70">
                {["ga", "lau", "trang mieng", "do uong"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="rounded-full border border-clay-200 bg-clay-100/70 px-3 py-1 transition hover:border-sea-600 hover:text-sea-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-ink-700/60">
                  Danh muc
                </label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-2xl border border-clay-200 bg-white/80 px-4 py-3 text-sm text-ink-900 shadow-sm focus:border-sea-600 focus:outline-none focus:ring-2 focus:ring-sea-600/30"
                >
                  <option value="all">Tat ca</option>
                  {Object.keys(difficultyLabel).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-ink-700/60">
                  Danh gia
                </label>
                <select
                  value={minRating}
                  onChange={(event) => setMinRating(event.target.value)}
                  className="w-full rounded-2xl border border-clay-200 bg-white/80 px-4 py-3 text-sm text-ink-900 shadow-sm focus:border-sea-600 focus:outline-none focus:ring-2 focus:ring-sea-600/30"
                >
                  <option value="all">Tat ca</option>
                  <option value="4.5">4.5+</option>
                  <option value="4.0">4.0+</option>
                  <option value="3.5">3.5+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-ink-700/60">
                  Sap xep
                </label>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-2xl border border-clay-200 bg-white/80 px-4 py-3 text-sm text-ink-900 shadow-sm focus:border-sea-600 focus:outline-none focus:ring-2 focus:ring-sea-600/30"
                >
                  <option value="popular">Ban chay</option>
                  <option value="rating">Danh gia cao</option>
                  <option value="price-asc">Gia tang dan</option>
                  <option value="price-desc">Gia giam dan</option>
                  <option value="newest">Moi nhat</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-[0.3em] text-ink-700/60">
                  Gia toi da
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPriceLimit}
                  step="5000"
                  value={maxPrice ?? 0}
                  onChange={(event) =>
                    setMaxPrice(Number(event.target.value))
                  }
                  className="w-full accent-sea-600"
                />
                <p className="text-sm font-semibold text-ink-900">
                  {formatCurrency(maxPrice || 0)}
                </p>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-dashed border-clay-200 bg-clay-100/60 px-4 py-3 text-xs text-ink-700/80">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(event) => setInStock(event.target.checked)}
                  className="h-4 w-4 accent-sea-600"
                />
                Chi hien mon con hang
              </label>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-2xl border border-clay-200 bg-white/80 px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-sea-600 hover:text-sea-700"
              >
                Dat lai bo loc
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-700/80">
                Ket qua tim kiem:{" "}
                <span className="font-semibold text-ink-900">
                  {products.length}
                </span>
              </p>
              {activeFilters.length ? (
                <div className="flex flex-wrap gap-2 text-xs text-ink-700/70">
                  {activeFilters.map((filter) => (
                    <span
                      key={filter}
                      className="rounded-full border border-clay-200 bg-white/80 px-3 py-1"
                    >
                      {filter}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink-700/60">Chua ap dung bo loc.</p>
              )}
            </div>

            {loading ? (
              <div className="rounded-3xl border border-dashed border-clay-200 bg-white/70 p-10 text-center text-sm text-ink-700/70">
                Dang tai du lieu...
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-dashed border-clay-200 bg-white/70 p-10 text-center text-sm text-ink-700/70">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-clay-200 bg-white/70 p-10 text-center text-sm text-ink-700/70">
                Khong tim thay mon an phu hop. Thu giam bo loc hoac doi tu khoa.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {products.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-float backdrop-blur"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2 text-xs">
                        {item.isPromo && (
                          <span className="rounded-full bg-sunset-400/90 px-3 py-1 text-white">
                            Khuyen mai
                          </span>
                        )}
                        {item.isNew && (
                          <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-white">
                            Moi
                          </span>
                        )}
                        {item.isBestSeller && (
                          <span className="rounded-full bg-sea-600/90 px-3 py-1 text-white">
                            Ban chay
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display text-xl text-ink-900">
                            {item.name}
                          </h3>
                          <span className="rounded-full bg-clay-100 px-3 py-1 text-xs text-ink-700/80">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-ink-700/75">
                          {item.description}
                        </p>
                      </div>

                      <div className="grid gap-3 text-xs text-ink-700/80 sm:grid-cols-2">
                        <div className="rounded-2xl border border-clay-200 bg-clay-50 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-ink-700/50">
                            Danh gia
                          </p>
                          <p className="text-sm font-semibold text-ink-900">
                            {item.rating} / 5
                          </p>
                        </div>
                        <div className="rounded-2xl border border-clay-200 bg-clay-50 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-ink-700/50">
                            Da ban
                          </p>
                          <p className="text-sm font-semibold text-ink-900">
                            {item.sold}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-clay-200 bg-clay-50 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-ink-700/50">
                            Ton kho
                          </p>
                          <p className="text-sm font-semibold text-ink-900">
                            {item.stock}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-clay-200 bg-clay-50 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-ink-700/50">
                            Gia
                          </p>
                          <p className="text-sm font-semibold text-ink-900">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2 text-xs text-ink-700/70">
                          {(item.tags || []).map((tag) => (
                            <span
                              key={`${item.id}-${tag}`}
                              className="rounded-full border border-clay-200 bg-white/80 px-3 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-ink-700/60">
                          {item.stock > 0 ? `Con ${item.stock} phan` : "Het hang"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
