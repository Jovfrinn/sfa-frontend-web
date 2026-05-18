import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import Loader from "../../components/loader/loader";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/authSlice";
import { useSelector } from "react-redux";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated]);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URI}/auth/login`,
          formData
        );

        const user = response.data.data.user;
        const token = response.data.data.token;
        dispatch(loginSuccess({ user, token }));

        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        navigate("/dashboard");
      } catch (error) {
        setIsLoading(false);
        console.error("Login error:", error.response?.data?.message);
        const errorMessage =
          error.response?.data?.message || "Terjadi kesalahan saat login!";
        setErrors({ general: errorMessage });
      }
    } else {
      setErrors(newErrors);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className="login-page-wrapper">
        <div className="bg-elements">
          <div className="bg-card-top"></div>
          <div className="bg-card-bottom"></div>
        </div>

        <div className="login-container">
          <header className="logot-padding">
            <img
              src="/assets/loader/Logo.png"
              alt="Logo Univerz Tech"
              className="logo-img"
            />
          </header>
          <main className="row align-items-center flex-grow-1 g-4 container-main">
            {/* Login Form */}
            <div className="col-12 col-lg-6 order-2 order-lg-2">
              <div className="mx-auto" style={{ maxWidth: "500px" }}>
                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      name="username"
                      className={`form-control form-control-lg ${
                        errors.username ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      style={{
                        borderRadius: "10px",
                        borderWidth: "2px",
                      }}
                    />
                    {errors.username && (
                      <div className="invalid-feedback d-block">
                        {errors.username}
                      </div>
                    )}
                    {errors.general && (
                      <div className="invalid-feedback d-block">
                        {errors.general}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control form-control-lg ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        style={{
                          borderRadius: "10px",
                          borderWidth: "2px",
                          paddingRight: "45px",
                        }}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Icon icon="mdi:eye-off" width="20" height="20" />
                        ) : (
                          <Icon icon="mdi:eye" width="20" height="20" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  {/* Forgot Password */}
                  <div className="d-flex justify-content-end mb-3">
                    <a
                      href="#"
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 btn-login-custom"
                  >
                    Login
                  </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-4 text-muted">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="col-12 col-lg-6 order-1 order-lg-1">
              <div
                className="d-flex justify-content-center align-items-center position-relative container-img"
                style={{ minHeight: "250px" }}
              >
                <img
                  src="/assets/images/asset-landing.png"
                  alt="3D Design Graphic"
                  className="hero-img"
                />
                <div className="floating-dot dot-green"></div>
                <div className="floating-dot dot-blue"></div>
                <div className="floating-dot dot-orange"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
