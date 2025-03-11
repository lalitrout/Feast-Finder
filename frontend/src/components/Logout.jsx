import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lastPage = localStorage.getItem("lastPage") || "/";
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    
    toast.success("You have been logged out.", { autoClose: 2000 });

    setTimeout(() => {
      navigate(lastPage); // ✅ Redirects to last visited page
      window.location.reload();
    }, 2000);
  }, [navigate]);

  return null;
};

export default Logout;
