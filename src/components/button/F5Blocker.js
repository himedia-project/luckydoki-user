// F5Blocker.jsx (예시)
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function F5Blocker() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F5") {
        e.preventDefault();
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return null;
}

export default F5Blocker;
