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
  if (filters.isPromo === true) params.isPromo = true;
  if (filters.isNew === true) params.isNew = true;
  if (filters.isBestSeller === true) params.isBestSeller = true;
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

export const getProductByIdApi = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTopProductsApi = async ({ type, page, limit } = {}) => {
  try {
    const response = await api.get("/api/products/top", {
      params: {
        ...(type ? { type } : {}),
        ...(Number.isFinite(page) ? { page } : {}),
        ...(Number.isFinite(limit) ? { limit } : {}),
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
