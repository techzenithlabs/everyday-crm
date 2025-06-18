import api from "../api";
import { AxiosError } from "axios";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role_id?: number; // optional if you're assigning on backend
}


export const registerUser = async (form: RegisterPayload) => {
  try {
    const response = await api.post("/register", form);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw err.response?.data || { message: "Registration failed" };
  }
};

// Fetch user profile
export const getProfile = async (token: string) => {
  try {
    const response = await api.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw err.response?.data || { message: "Failed to fetch profile" };
  }
};


export const updateProfile = async (token: string, data: any) => {
  const response = await api.put("/profile/update", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw err.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async (token: string) => {
  return await api.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw (
      err.response?.data || { message: "Failed to send reset password link." }
    );
  }
};

export const resetPassword = async (payload: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const response = await api.post("/reset-password", payload);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    throw err.response?.data || { message: "Reset password failed" };
  }
};
