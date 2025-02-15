import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function F5Blocker() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "F5" ||
        (e.ctrlKey && e.key === "r") ||
        (e.metaKey && e.key === "r")
      ) {
        e.preventDefault();
        navigate("/");
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      navigate("/");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  return null;
}

export default F5Blocker;
