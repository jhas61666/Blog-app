import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Load theme from localStorage if available, otherwise default to "dark"
  theme: localStorage.getItem("theme") || "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;

      // Save preference in localStorage
      localStorage.setItem("theme", newTheme);

      // Update <html> class for Tailwind
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
