import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";
import { getPasswordStrength } from "../../utils/validators";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: "none",
    score: 0,
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    const strength = getPasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        resetPassword({ token, newPassword: formData.password }),
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
        <h1 className='auth-title'>Create New Password</h1>
        <p className='auth-subtitle'>Enter your new password below</p>

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
            <label className='label label-required'>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                className={`input ${errors.password ? "input-error" : ""}`}
                placeholder='Enter new password'
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete='new-password'
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='password-toggle-btn'
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
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
            <label className='label label-required'>Confirm New Password</label>
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

          <button
            type='submit'
            className='btn btn-primary btn-block btn-lg'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className='spinner spinner-sm'></span>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className='auth-footer'>
          <Link to='/login'>Back to Log In</Link>
        </div>
      </div>
    </div>
  );
};
