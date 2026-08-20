// src/components/auth/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";
import { validateEmail } from "../../utils/validators";

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    if (!email) {
      setFieldError("Email is required");
      return false;
    }
    if (!validateEmail(email)) {
      setFieldError("Please enter a valid email address");
      return false;
    }
    setFieldError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(forgotPassword(email)).unwrap();
    } catch (err) {
      // Error handled by thunk
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h1 className='auth-title'>Reset Password</h1>
        <p className='auth-subtitle'>
          Enter your email address and we'll send you a link to reset your
          password
        </p>

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
              className={`input ${fieldError ? "input-error" : ""}`}
              placeholder='your@email.com'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldError) setFieldError("");
              }}
              disabled={isLoading || success}
              autoComplete='email'
            />
            {fieldError && <div className='form-error'>{fieldError}</div>}
          </div>

          <button
            type='submit'
            className='btn btn-primary btn-block btn-lg'
            disabled={isLoading || success}
          >
            {isLoading ? (
              <>
                <span className='spinner spinner-sm'></span>
                Sending...
              </>
            ) : (
              "Send Reset Link"
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
