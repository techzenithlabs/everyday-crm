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


export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;    
    throw err.response?.data || { message: "Login failed" };
  }
};

