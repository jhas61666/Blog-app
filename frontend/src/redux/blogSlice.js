import { createSlice } from "@reduxjs/toolkit";  // ✅ Correct import

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    loading: false,
    blog: []
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload; // ✅ payload, not payloadload
    },
    setBlog: (state, action) => {
      state.blog = action.payload; // ✅ payload, not payloadload
    },
  }
});

export const { setLoading, setBlog } = blogSlice.actions;
export default blogSlice.reducer;
