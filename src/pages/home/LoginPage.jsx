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
      <style>{`
        .login-premium-bg {
          background-color: #f0f2f5;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: 'Inter', sans-serif;
        }
        .login-premium-card {
          background-color: #ffffff;
          border-radius: 32px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.07);
          width: 100%;
          max-width: 1100px;
          padding: 3rem;
          margin: auto;
        }
        .login-header-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -1px;
          line-height: 1;
        }
        .login-logo {
          width: 48px;
          height: auto;
          border-radius: 12px;
        }
        .login-input-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .login-input-field {
          height: 52px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-size: 0.95rem;
          padding: 0 16px;
          color: #111827;
          transition: all 0.2s ease;
          box-shadow: none !important;
          background-color: #fff;
        }
        .login-input-field::placeholder {
          color: #9ca3af;
        }
        .login-input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        }
        .login-btn-primary {
          background-color: #1a73e8;
          border-radius: 50px;
          height: 52px;
          font-weight: 700;
          font-size: 1rem;
          color: #ffffff;
          border: none;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
        }
        .login-btn-primary:hover {
          background-color: #1557b0;
          transform: translateY(-1px);
        }
        .login-link {
          color: #1a73e8;
          font-weight: 700;
          text-decoration: none;
          font-size: 0.85rem;
        }
        .login-link:hover {
          text-decoration: underline;
        }
        .login-hero-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding-top: 2rem;
        }
        .login-hero-img {
          width: 100%;
          max-width: 400px;
          z-index: 2;
        }
        .login-dot {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          filter: blur(0.5px);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 991.98px) {
          .login-premium-card {
            padding: 2rem;
            border-radius: 24px;
          }
          .login-header-title {
            font-size: 2.5rem;
            letter-spacing: -1px;
          }
          .login-hero-img {
            max-width: 280px;
          }
          .login-hero-container {
            padding-bottom: 2rem;
          }
        }
        @media (max-width: 575.98px) {
          .login-premium-card {
            padding: 1.5rem;
          }
          .login-header-title {
            font-size: 2rem;
          }
        }
      `}</style>

      {isLoading && <Loader />}

      <div className="login-premium-bg">
        <div className="login-premium-card">
          <div className="row g-4 align-items-center">
            
            {/* Left Side: Branding & Illustration */}
            <div className="col-12 col-lg-6 d-flex flex-column">
              
              <div className="d-flex align-items-center mb-2 mb-lg-4">
                <img
                  src="/assets/loader/Logo.png"
                  alt="Logo"
                  className="login-logo"
                />
                <div className="login-header-title mb-0">My Sales</div>
              </div>

              <div className="login-hero-container">
                <img
                  src="/assets/images/asset-landing.png"
                  alt="3D Illustration"
                  className="login-hero-img"
                />
                {/* Decorative Dots */}
                <div className="login-dot" style={{ backgroundColor: '#4ade80', top: '20%', right: '15%' }}></div>
                <div className="login-dot" style={{ backgroundColor: '#3b82f6', bottom: '25%', left: '10%' }}></div>
                <div className="login-dot" style={{ backgroundColor: '#fbbf24', bottom: '5%', right: '25%' }}></div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="col-12 col-lg-6 d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: '400px' }}>
                <form onSubmit={handleSubmit}>
                  
                  {/* Username */}
                  <div className="mb-4">
                    <label className="form-label login-input-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      className={`form-control login-input-field ${errors.username ? 'is-invalid' : ''}`}
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {errors.username && <div className="invalid-feedback d-block">{errors.username}</div>}
                    {errors.general && <div className="invalid-feedback d-block">{errors.general}</div>}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="form-label login-input-label">Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`form-control login-input-field ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        style={{ paddingRight: '48px' }}
                      />
                      <button
                        type="button"
                        className="position-absolute top-50 translate-middle-y border-0 bg-transparent d-flex align-items-center justify-content-center"
                        style={{ right: '12px', color: '#9ca3af', padding: '0', cursor: 'pointer', zIndex: 5 }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Icon icon="mdi:eye-off" width="20" height="20" />
                        ) : (
                          <Icon icon="mdi:eye" width="20" height="20" />
                        )}
                      </button>
                    </div>
                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                  </div>

                  {/* Forgot Password */}
                  <div className="d-flex justify-content-end mb-4">
                    <a href="#" className="login-link">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="w-100 login-btn-primary">
                    Login
                  </button>
                </form>

                {/* Register */}
                <div className="text-center mt-4" style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '500' }}>
                  Don't have an account? <a href="#" className="login-link">Create Account</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
