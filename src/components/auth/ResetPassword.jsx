import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  resetPassword,
  clearError,
  clearSuccess,
} from "../../redux/slices/authSlice";
import {
  validatePassword,
  getPasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
} from "../../utils/validators";

export const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const passwordStrength = getPasswordStrength(password);
  const strengthColor = getPasswordStrengthColor(password);
  const strengthLabel = getPasswordStrengthLabel(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message);
      return;
    }
    setPasswordError("");

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");

    // Reset password
    const result = await dispatch(
      resetPassword({ token, newPassword: password }),
    );

    if (result.payload && result.payload.message) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div className='reset-password-container'>
      <div className='reset-password-card'>
        <h1 className='heading-2'>Reset Password</h1>
        <p className='body-small'>Enter your new password</p>

        {error && (
          <div className='alert alert-error'>{error.error || error}</div>
        )}
        {success && (
          <div className='alert alert-success'>
            {success} Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label className='label label-required'>New Password</label>
            <input
              type='password'
              className={`input ${passwordError ? "input-error" : ""}`}
              placeholder='Enter new password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              <div style={{ marginTop: "8px" }}>
                <div
                  style={{
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: "#e4e4e0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width:
                        passwordStrength === "strong"
                          ? "100%"
                          : passwordStrength === "medium"
                            ? "60%"
                            : "30%",
                      backgroundColor: strengthColor,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: strengthColor,
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {strengthLabel}
                </span>
              </div>
            )}
            {passwordError && (
              <span className='form-error'>{passwordError}</span>
            )}
          </div>

          <div className='form-group'>
            <label className='label label-required'>Confirm Password</label>
            <input
              type='password'
              className={`input ${confirmError ? "input-error" : ""}`}
              placeholder='Confirm new password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmError && <span className='form-error'>{confirmError}</span>}
          </div>

          <button
            type='submit'
            className='btn btn-primary'
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className='divider'></div>

        <p className='body-small' style={{ textAlign: "center" }}>
          Remember your password?{" "}
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
