import api from "./api";

const buildParams = (filters) => {
  const params = {};
  if (filters.q) params.q = filters.q;
  if (filters.category && filters.category !== "all") {
    params.category = filters.category;
  }
  if (filters.difficulty && filters.difficulty !== "all") {
    params.difficulty = filters.difficulty;
  }
  if (filters.sort) params.sort = filters.sort;
  if (filters.author_id) params.author_id = filters.author_id;
  return params;
};

export const searchRecipesApi = async (filters = {}) => {
  try {
    const response = await api.get("/api/recipes", {
      params: buildParams(filters),
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRecipeByIdApi = async (id) => {
  try {
    const response = await api.get(`/api/recipes/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRecipeBySlugApi = async (slug) => {
  try {
    const response = await api.get(`/api/recipes/slug/${slug}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createRecipeApi = async (recipeData) => {
  try {
    const response = await api.post("/api/recipes", recipeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateRecipeApi = async (id, recipeData) => {
  try {
    const response = await api.put(`/api/recipes/${id}`, recipeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteRecipeApi = async (id) => {
  try {
    const response = await api.delete(`/api/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reviews
export const submitReviewApi = async (recipeId, rating, comment) => {
  try {
    const response = await api.post(`/api/recipes/${recipeId}/reviews`, {
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Comments
export const submitCommentApi = async (recipeId, content, parentId = null) => {
  try {
    const response = await api.post(`/api/recipes/${recipeId}/comments`, {
      content,
      parentId,
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteCommentApi = async (commentId) => {
  try {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Saved Recipes
export const getSavedRecipesApi = async () => {
  try {
    const response = await api.get("/api/me/saved-recipes");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const saveRecipeApi = async (recipeId) => {
  try {
    const response = await api.post(`/api/recipes/${recipeId}/save`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const unsaveRecipeApi = async (recipeId) => {
  try {
    const response = await api.delete(`/api/recipes/${recipeId}/save`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkSavedStatusApi = async (recipeId) => {
  try {
    const response = await api.get(`/api/recipes/${recipeId}/saved-status`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Follows
export const followUserApi = async (userId) => {
  try {
    const response = await api.post(`/api/users/${userId}/follow`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const unfollowUserApi = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}/follow`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkFollowStatusApi = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/follow-status`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getChefProfileApi = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFollowersApi = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/followers`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFollowingApi = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/following`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
