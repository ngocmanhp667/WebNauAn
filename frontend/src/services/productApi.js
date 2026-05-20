import api from "./api";

const buildParams = (filters) => {
  const params = {};

  if (filters.query) params.query = filters.query;
  if (filters.category && filters.category !== "all") {
    params.category = filters.category;
  }
  if (Number.isFinite(filters.minPrice)) params.minPrice = filters.minPrice;
  if (Number.isFinite(filters.maxPrice)) params.maxPrice = filters.maxPrice;
  if (Number.isFinite(filters.minRating)) params.minRating = filters.minRating;
  if (filters.inStock === true) params.inStock = true;
  if (filters.sort && filters.sort !== "popular") params.sort = filters.sort;

  return params;
};

export const searchProductsApi = async (filters = {}) => {
  try {
    const response = await api.get("/api/products", {
      params: buildParams(filters),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
