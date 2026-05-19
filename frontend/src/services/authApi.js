import api from "./api";

export const forgotPasswordApi = async (email) => {
  try {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPasswordApi = async (
  email,
  otp,
  newPassword,
  confirmPassword,
) => {
  try {
    const response = await api.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
