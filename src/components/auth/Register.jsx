import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  registerUser,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";

export const Register = () => {
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerUser(formData));
    if (result.payload?.message) {
      setFormData({ email: "", password: "", full_name: "", phone_number: "" });
    }
  };

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || error?.error || error?.email || "Registration failed";

  return (
    <div className='register-container'>
      <div className='register-card'>
        <h1 className='heading-2'>Create Account</h1>
        <p className='body-small'>Join Ajali! to report incidents</p>

        {error && <div className='alert alert-error'>{errorMessage}</div>}
        {success && <div className='alert alert-success'>{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* ... form fields ... */}
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};
