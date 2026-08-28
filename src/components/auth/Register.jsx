import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";

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

    // Validate
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.full_name) newErrors.full_name = "Full name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch(clearError());

    const result = await dispatch(registerUser(formData));

    if (result.payload?.message) {
      setFormData({
        email: "",
        password: "",
        full_name: "",
        phone_number: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || error?.error || "Registration failed";

  return (
    <div className='register-container'>
      <div className='register-card'>
        <h1 className='heading-2'>Create Account</h1>
        <p className='body-small'>Join Ajali! to report incidents</p>

        {error && <div className='alert alert-error'>{errorMessage}</div>}
        {success && <div className='alert alert-success'>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='label label-required'>Full Name</label>
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
            <label className='label label-required'>Email</label>
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
            <label className='label label-required'>Password</label>
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

        <div className='divider'></div>

        <p className='body-small' style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            to='/login'
            style={{ color: "var(--color-navy)", fontWeight: "600" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
