import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  loginUser,
  clearError,
} from "../../redux/slices/authSlice";
import "../../styles/auth.css";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch(clearError());
    setIsRegistering(true);

    try {
      // Step 1: Register the user
      const registerResult = await dispatch(
        registerUser({
          email: formData.email.trim(),
          password: formData.password,
          full_name: formData.full_name.trim(),
          phone_number: formData.phone_number.trim() || "",
        }),
      ).unwrap();

      console.log("Registration successful:", registerResult);

      // Step 2: Auto-login the user
      const loginResult = await dispatch(
        loginUser({
          email: formData.email.trim(),
          password: formData.password,
        }),
      ).unwrap();

      console.log("Auto-login successful:", loginResult);

      // Step 3: Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration or login error:", err);
      // Show error message
      const errorMsg =
        typeof err === "string"
          ? err
          : err?.message || err?.error || err?.email || "Registration failed";
      // Set error in state for display
      // The error will be in the Redux state from the rejected thunk
    } finally {
      setIsRegistering(false);
    }
  };

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || error?.error || error?.email || "";

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-card-header'>
          <h1>Create Account</h1>
          <p>Join Ajali! to report incidents</p>
        </div>

        {errorMessage && (
          <div className='alert alert-error'>{errorMessage}</div>
        )}
        {success && !errorMessage && (
          <div className='alert alert-success'>{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='label'>Full Name</label>
            <input
              type='text'
              name='full_name'
              className={`input ${errors.full_name ? "input-error" : ""}`}
              placeholder='Enter your full name'
              value={formData.full_name}
              onChange={handleChange}
              disabled={isRegistering}
            />
            {errors.full_name && (
              <span className='form-error'>{errors.full_name}</span>
            )}
          </div>

          <div className='form-group'>
            <label className='label'>Email</label>
            <input
              type='email'
              name='email'
              className={`input ${errors.email ? "input-error" : ""}`}
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              disabled={isRegistering}
            />
            {errors.email && <span className='form-error'>{errors.email}</span>}
          </div>

          <div className='form-group'>
            <label className='label'>Password</label>
            <input
              type='password'
              name='password'
              className={`input ${errors.password ? "input-error" : ""}`}
              placeholder='Create a password (min 8 characters)'
              value={formData.password}
              onChange={handleChange}
              disabled={isRegistering}
            />
            {errors.password && (
              <span className='form-error'>{errors.password}</span>
            )}
          </div>

          <div className='form-group'>
            <label className='label'>Phone Number</label>
            <input
              type='tel'
              name='phone_number'
              className='input'
              placeholder='Enter your phone number (optional)'
              value={formData.phone_number}
              onChange={handleChange}
              disabled={isRegistering}
            />
          </div>

          <button
            type='submit'
            className='btn btn-primary'
            disabled={isRegistering || isLoading}
          >
            {isRegistering ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className='auth-footer'>
          <span>Already have an account?</span>
          <Link to='/login' className='auth-link'>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
