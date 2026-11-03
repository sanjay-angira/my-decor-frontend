import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type StoreUser = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImage?: string | null;
};

type UserAuthState = {
  user: StoreUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    setAuthenticatedUser(state, action: PayloadAction<StoreUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    clearAuthenticatedUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setAuthLoading,
  setAuthError,
  setAuthenticatedUser,
  clearAuthenticatedUser,
} = userAuthSlice.actions;
export default userAuthSlice.reducer;
