import { createSlice } from "@reduxjs/toolkit";  // ✅ Correct import

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload; // ✅ payload, not payloadload
    },
    setUser: (state, action) => {
      state.user = action.payload; // ✅ payload, not payloadload
    },
  }
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
