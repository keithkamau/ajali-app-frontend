// src/components/auth/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";
import {
  validateEmail,
  validatePhoneNumber,
  validateFullName,
  getPasswordStrength,
} from "../../utils/validators";

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, success, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: "none",
    score: 0,
  });

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
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Update password strength
  useEffect(() => {
    const strength = getPasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    } else if (!validateFullName(formData.fullName)) {
      newErrors.fullName = "Name must be between 2 and 100 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid Kenyan phone number (e.g., 0712345678)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      const { fullName, email, phoneNumber, password } = formData;
      await dispatch(
        registerUser({
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          password,
        }),
      ).unwrap();
    } catch (err) {
      // Error handled by thunk
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength.level) {
      case "strong":
        return "Strong";
      case "medium":
        return "Medium";
      case "weak":
        return "Weak";
      default:
        return "";
    }
  };

  const getStrengthClass = () => {
    switch (passwordStrength.level) {
      case "strong":
        return "strong";
      case "medium":
        return "medium";
      case "weak":
        return "weak";
      default:
        return "";
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>Create Account</h1>
        <p className='auth-subtitle'>Join Ajali to get started</p>

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
            <label className='label label-required'>Full Name</label>
            <input
              type='text'
              name='fullName'
              className={`input ${errors.fullName ? "input-error" : ""}`}
              placeholder='Enter your full name'
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete='name'
            />
            {errors.fullName && (
              <div className='form-error'>{errors.fullName}</div>
            )}
          </div>

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
            <label className='label'>Phone Number</label>
            <input
              type='tel'
              name='phoneNumber'
              className={`input ${errors.phoneNumber ? "input-error" : ""}`}
              placeholder='0712345678'
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete='tel'
            />
            <div className='form-hint'>
              Optional but recommended for SMS alerts
            </div>
            {errors.phoneNumber && (
              <div className='form-error'>{errors.phoneNumber}</div>
            )}
          </div>

          <div className='form-group'>
            <label className='label label-required'>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                className={`input ${errors.password ? "input-error" : ""}`}
                placeholder='Create a strong password'
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete='new-password'
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

            {formData.password && (
              <>
                <div className='password-strength'>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`password-strength-bar ${i <= passwordStrength.score ? getStrengthClass() : ""}`}
                    />
                  ))}
                </div>
                <div className={`password-strength-text ${getStrengthClass()}`}>
                  Password strength: {getStrengthLabel()}
                </div>
              </>
            )}

            {errors.password && (
              <div className='form-error'>{errors.password}</div>
            )}
          </div>

          <div className='form-group'>
            <label className='label label-required'>Confirm Password</label>
            <input
              type='password'
              name='confirmPassword'
              className={`input ${errors.confirmPassword ? "input-error" : ""}`}
              placeholder='Confirm your password'
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              autoComplete='new-password'
            />
            {errors.confirmPassword && (
              <div className='form-error'>{errors.confirmPassword}</div>
            )}
          </div>

          <div className='form-group'>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <input
                type='checkbox'
                name='terms'
                checked={formData.terms}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span style={{ fontSize: "0.875rem" }}>
                I agree to the <Link to='/terms'>Terms of Service</Link> and{" "}
                <Link to='/privacy'>Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <div className='form-error'>{errors.terms}</div>}
          </div>

          <button
            type='submit'
            className='btn btn-primary btn-block btn-lg'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className='spinner spinner-sm'></span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className='auth-footer'>
          Already have an account? <Link to='/login'>Log in</Link>
        </div>
      </div>
    </div>
  );
};
