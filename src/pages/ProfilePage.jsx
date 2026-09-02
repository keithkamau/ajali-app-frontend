import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUser,
  logoutUser,
  clearSuccess,
  clearError,
} from "../redux/slices/authSlice";
import "./ProfilePage.css";

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, success, error } = useSelector(
    (state) => state.auth,
  );

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    if (success) {
      setFormMessage(success);
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        setFormMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      setFormMessage(
        typeof error === "string"
          ? error
          : error?.message || "An error occurred",
      );
      const timer = setTimeout(() => {
        dispatch(clearError());
        setFormMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(
      updateUser({
        full_name: formData.full_name.trim(),
        phone_number: formData.phone_number.trim(),
      }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      setFormMessage("Profile updated successfully!");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!passwordData.current_password)
      newErrors.current_password = "Current password is required";
    if (!passwordData.new_password || passwordData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // This would need a changePassword action in authSlice
    setFormMessage("Password change functionality coming soon!");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <h1 className='page-title'>Profile</h1>
        <p className='page-subtitle'>Manage your account settings</p>
      </div>

      {formMessage && (
        <div
          className={`profile-message ${formMessage.includes("error") || formMessage.includes("failed") ? "profile-message-error" : "profile-message-success"}`}
        >
          {formMessage}
        </div>
      )}

      <div className='profile-container'>
        {/* Sidebar */}
        <div className='profile-sidebar'>
          <div className='profile-avatar-section'>
            <div className='profile-avatar'>
              {user?.full_name ? (
                <span>
                  {user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              ) : (
                <span>U</span>
              )}
            </div>
            <div>
              <h3 className='profile-avatar-name'>
                {user?.full_name || "User"}
              </h3>
              <p className='profile-avatar-email'>{user?.email || ""}</p>
            </div>
          </div>

          <nav className='profile-nav'>
            <button
              className={`profile-nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Edit Profile
            </button>
            <button
              className={`profile-nav-item ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              Change Password
            </button>
            <button
              className='profile-nav-item profile-nav-logout'
              onClick={handleLogout}
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className='profile-content'>
          {activeTab === "profile" && (
            <div className='profile-card'>
              <h2 className='profile-card-title'>Edit Profile</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className='form-group'>
                  <label className='label'>Full Name</label>
                  <input
                    type='text'
                    name='full_name'
                    className={`input ${errors.full_name ? "input-error" : ""}`}
                    value={formData.full_name}
                    onChange={handleProfileChange}
                    placeholder='Enter your full name'
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
                    className='input input-disabled'
                    value={formData.email}
                    disabled
                  />
                  <span className='form-hint'>Email cannot be changed</span>
                </div>

                <div className='form-group'>
                  <label className='label'>Phone Number</label>
                  <input
                    type='tel'
                    name='phone_number'
                    className='input'
                    value={formData.phone_number}
                    onChange={handleProfileChange}
                    placeholder='Enter your phone number'
                  />
                </div>

                <div className='form-actions'>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className='profile-card'>
              <h2 className='profile-card-title'>Change Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className='form-group'>
                  <label className='label'>Current Password</label>
                  <input
                    type='password'
                    name='current_password'
                    className={`input ${errors.current_password ? "input-error" : ""}`}
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder='Enter current password'
                  />
                  {errors.current_password && (
                    <span className='form-error'>
                      {errors.current_password}
                    </span>
                  )}
                </div>

                <div className='form-group'>
                  <label className='label'>New Password</label>
                  <input
                    type='password'
                    name='new_password'
                    className={`input ${errors.new_password ? "input-error" : ""}`}
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder='Enter new password (min 8 characters)'
                  />
                  {errors.new_password && (
                    <span className='form-error'>{errors.new_password}</span>
                  )}
                </div>

                <div className='form-group'>
                  <label className='label'>Confirm New Password</label>
                  <input
                    type='password'
                    name='confirm_password'
                    className={`input ${errors.confirm_password ? "input-error" : ""}`}
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder='Confirm new password'
                  />
                  {errors.confirm_password && (
                    <span className='form-error'>
                      {errors.confirm_password}
                    </span>
                  )}
                </div>

                <div className='form-actions'>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
