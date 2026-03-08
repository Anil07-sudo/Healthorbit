import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { loginPageStyles, toastStyles } from "../../dummyStyles";
import logo from "../images/logo2.png";
import { ArrowLeft } from "lucide-react";

const STORAGE_KEY = "doctorToken_v1";

const LoginPage = () => {
  const API_BASE = "https://healthorbit-backend.onrender.com";
  const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required.", {
        style: toastStyles.errorToast,
      });
      return;
    }

    setBusy(true);

    try {
      const res = await fetch(`${API_BASE}/api/doctors/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Login failed", {
          style: toastStyles.errorToast,
        });
        setBusy(false);
        return;
      }

      const token = data?.token || data?.data?.token;
      if (!token) {
        toast.error("Authentication token missing");
        setBusy(false);
        return;
      }

      const doctorId =
        data?.data?._id ||
        data?.doctor?._id ||
        data?.data?.doctor?._id;

      if (!doctorId) {
        toast.error("Doctor ID missing from server response");
        setBusy(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, token);

      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: token })
      );

      toast.success("Login successful — redirecting...", {
        style: toastStyles.successToast,
      });

      setTimeout(() => {
        navigate(`/doctor-admin/${doctorId}`);
      }, 700);

    } catch (err) {
      console.error("login error", err);
      toast.error("Network error during login");
    } finally {
      setBusy(false);
    }
  };

  return (
   <div className={loginPageStyles.mainContainer}>
  <Toaster position="top-right" reverseOrder={false} />

  <button
    onClick={() => navigate("/")}
    className={loginPageStyles.backButton}
  >
    <ArrowLeft className={loginPageStyles.backButtonIcon} />
    Back to Home
  </button>
  <div className={loginPageStyles.loginCard}>
  <div className={loginPageStyles.logoContainer}>
    <img src={logo} alt="logo" className={loginPageStyles.logo} />
  </div>

  <h2 className={loginPageStyles.title}>Doctor Admin</h2>

  <p className={loginPageStyles.subtitle}>
    Sign in to manage your profile & schedule
  </p>
  <form onSubmit={handleLogin} className={loginPageStyles.form}>
  <input
    type="email"
    name="email"
    placeholder="Email Address"
    value={formData.email}
    onChange={handleChange}
    className={loginPageStyles.input}
    required
  />
   <input
    type="password"
    name="password"
    placeholder="password"
    value={formData.password}
    onChange={handleChange}
    className={loginPageStyles.input}
    required
  />
  <button
  type="submit"
  disabled={busy}
  className={loginPageStyles.submitButton}
>
  {busy ? "Signing in..." : "Login"}
</button>
</form>
</div>
</div>
  );
};

export default LoginPage;