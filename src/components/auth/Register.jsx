import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../../redux/slices/authSlice";
import "../../styles/auth.css";

export const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const result = await dispatch(
        registerUser({
          email: formData.email.trim(),
          password: formData.password,
          full_name: formData.full_name.trim(),
          phone_number: formData.phone_number.trim() || "",
        }),
      );

      // Check if registration was successful
      if (result.meta.requestStatus === "fulfilled") {
        // Clear form
        setFormData({
          email: "",
          password: "",
          full_name: "",
          phone_number: "",
        });

        // Navigate to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Registration failed - error is already in Redux state
        console.error("Registration failed:", result.payload);
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  // Get error message properly
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || error?.error || error?.email || "Registration failed";

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-card-header'>
          <h1>Create Account</h1>
          <p>Join Ajali! to report incidents</p>
        </div>

        {error && <div className='alert alert-error'>{errorMessage}</div>}
        {success && <div className='alert alert-success'>{success}</div>}

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
            />
          </div>

          <button
            type='submit'
            className='btn btn-primary'
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Register"}
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
