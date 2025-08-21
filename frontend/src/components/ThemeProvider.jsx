import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);

  // ✅ Apply theme class on <html> tag when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen w-full bg-gray-200 text-gray-800 dark:bg-[rgb(16,23,42)] dark:text-gray-200">
      {children}
    </div>
  );
};

export default ThemeProvider;
