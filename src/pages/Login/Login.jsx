import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import "./Login.css";
import { PostCall } from "../../ApiServices";
import { showToast } from "../../main/ToastManager";
// import Loader from "../Helper/Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setUserInfo } from "../../store/userInfoSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await PostCall("/login", formData);
      console.log("response login ==>", response.data);
      if (response?.data?.status === 200) {
        const userInfo = response?.data?.user;
        localStorage.setItem(
          "token",
          JSON.stringify(response?.data?.user?.token)
        );

        dispatch(setUserInfo(userInfo));
        navigate("/dashboard");
        showToast(response?.data?.message, "success");
      } else {
        showToast(response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="main-login">
      <div className="login-section">
        <div className="login-bg">
          <img src="/image/login-bg.png" alt="login-img" />
        </div>
        <div className="login-form">
          <div className="form-container">
            <h1>Welcome to HRMS</h1>
            <p>Login your account</p>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  name="email"
                  className="login-input"
                  value={formData?.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <span className="error-text">{errors?.email}</span>
                )}
              </div>
              <div className="form-group">
                <label>Password*</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData?.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="login-input"
                  />
                  <span
                    className="toggle-password"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <span className="error-text">{errors?.password}</span>
                )}
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
