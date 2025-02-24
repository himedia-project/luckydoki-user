import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button onClick={() => setIsDarkMode((prev) => !prev)}>
      {isDarkMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}
    </button>
  );
};

export default DarkModeToggle;
