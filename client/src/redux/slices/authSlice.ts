import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  first_name: string;
  last_name: string;
  role_id: number;
  email: string;
  id: number;
  user_info?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;

      // ✅ Save to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          user_info: {
            ...state.user.user_info,
            ...action.payload.user_info,
          },
        };

        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});
export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
