// src/components/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";
import { validateEmail } from "../../utils/validators";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, success, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear global error when user types
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate("/home");
    } catch (err) {
      // Error handled by thunk
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>Welcome Back</h1>
        <p className='auth-subtitle'>Log in to your Ajali account</p>

        {error && (
          <div className='alert alert-error' style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {success && (
          <div className='alert alert-success' style={{ marginBottom: "1rem" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='label label-required'>Email</label>
            <input
              type='email'
              name='email'
              className={`input ${errors.email ? "input-error" : ""}`}
              placeholder='your@email.com'
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete='email'
            />
            {errors.email && <div className='form-error'>{errors.email}</div>}
          </div>

          <div className='form-group'>
            <label className='label label-required'>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                className={`input ${errors.password ? "input-error" : ""}`}
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete='current-password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-ink-muted)",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <div className='form-error'>{errors.password}</div>
            )}
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.25rem" }}>
            <Link
              to='/forgot-password'
              style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type='submit'
            className='btn btn-primary btn-block btn-lg'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className='spinner spinner-sm'></span>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className='auth-footer'>
          Don't have an account? <Link to='/register'>Sign up</Link>
        </div>
      </div>
    </div>
  );
};
