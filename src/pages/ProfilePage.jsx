// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogoutIcon, ArrowIcon, CloseIcon } from "../components/icons";
import { updateUser, logoutUser } from "../redux/slices/authSlice";
import {
  validateEmail,
  validatePhoneNumber,
  validateFullName,
} from "../utils/validators";

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phoneNumber: user?.phone_number || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(user?.full_name);

  // Open modal
  const openModal = (modalName) => {
    setActiveModal(modalName);
    setErrors({});
    setSuccess("");
    if (modalName === "editProfile") {
      setFormData({
        ...formData,
        fullName: user?.full_name || "",
        phoneNumber: user?.phone_number || "",
      });
    }
    if (modalName === "changePassword") {
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  // Close modal
  const closeModal = () => {
    setActiveModal(null);
    setErrors({});
    setSuccess("");
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    } else if (!validateFullName(formData.fullName)) {
      newErrors.fullName = "Name must be between 2 and 100 characters";
    }

    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid Kenyan phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update profile
    const updatedUser = {
      ...user,
      full_name: formData.fullName,
      phone_number: formData.phoneNumber,
    };
    dispatch(updateUser(updatedUser));
    setSuccess("Profile updated successfully!");
    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // In mock mode, just show success
    setSuccess("Password changed successfully!");
    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  // Handle deactivate account
  const handleDeactivate = () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate your account? This action cannot be undone.",
      )
    ) {
      // In mock mode, just logout
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  // Handle notification preferences
  const handleNotifications = () => {
    navigate("/notifications");
  };

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <div className='profile-avatar'>{initials}</div>
        <h1 className='heading-2'>{user?.full_name || "User"}</h1>
        <p className='body-small text-muted'>
          {user?.email || "user@email.com"}
        </p>
        <p className='body-small text-muted'>
          {user?.phone_number || "No phone number"}
        </p>
      </div>

      <div className='profile-settings'>
        <div className='card'>
          <h3 className='heading-4'>Account Settings</h3>
          <div className='divider'></div>

          <div
            className='profile-menu-item'
            onClick={() => openModal("editProfile")}
          >
            <span>Edit Profile</span>
            <span className='profile-menu-arrow'>
              <ArrowIcon color='var(--color-ink-muted)' size={16} />
            </span>
          </div>

          <div
            className='profile-menu-item'
            onClick={() => openModal("changePassword")}
          >
            <span>Change Password</span>
            <span className='profile-menu-arrow'>
              <ArrowIcon color='var(--color-ink-muted)' size={16} />
            </span>
          </div>

          <div className='profile-menu-item' onClick={handleNotifications}>
            <span>Notification Preferences</span>
            <span className='profile-menu-arrow'>
              <ArrowIcon color='var(--color-ink-muted)' size={16} />
            </span>
          </div>

          <div className='profile-menu-item' onClick={handleLogout}>
            <span>Logout</span>
            <span className='profile-menu-arrow'>
              <LogoutIcon color='var(--color-ink-muted)' size={16} />
            </span>
          </div>

          <div className='profile-menu-item danger' onClick={handleDeactivate}>
            <span>Deactivate Account</span>
            <span className='profile-menu-arrow'>
              <ArrowIcon color='var(--color-red)' size={16} />
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {activeModal === "editProfile" && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3 className='heading-4'>Edit Profile</h3>
              <button className='modal-close' onClick={closeModal}>
                <CloseIcon color='var(--color-ink-muted)' size={20} />
              </button>
            </div>
            <div className='modal-body'>
              {success && <div className='alert alert-success'>{success}</div>}
              {errors.general && (
                <div className='alert alert-error'>{errors.general}</div>
              )}
              <form onSubmit={handleProfileUpdate}>
                <div className='form-group'>
                  <label className='label label-required'>Full Name</label>
                  <input
                    type='text'
                    name='fullName'
                    className={`input ${errors.fullName ? "input-error" : ""}`}
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder='Enter your full name'
                  />
                  {errors.fullName && (
                    <div className='form-error'>{errors.fullName}</div>
                  )}
                </div>
                <div className='form-group'>
                  <label className='label'>Phone Number</label>
                  <input
                    type='tel'
                    name='phoneNumber'
                    className={`input ${errors.phoneNumber ? "input-error" : ""}`}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder='0712345678'
                  />
                  {errors.phoneNumber && (
                    <div className='form-error'>{errors.phoneNumber}</div>
                  )}
                  <div className='form-hint'>Optional for SMS alerts</div>
                </div>
                <div className='modal-actions'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary'>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {activeModal === "changePassword" && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h3 className='heading-4'>Change Password</h3>
              <button className='modal-close' onClick={closeModal}>
                <CloseIcon color='var(--color-ink-muted)' size={20} />
              </button>
            </div>
            <div className='modal-body'>
              {success && <div className='alert alert-success'>{success}</div>}
              <form onSubmit={handlePasswordChange}>
                <div className='form-group'>
                  <label className='label label-required'>
                    Current Password
                  </label>
                  <input
                    type='password'
                    name='currentPassword'
                    className={`input ${errors.currentPassword ? "input-error" : ""}`}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder='Enter current password'
                  />
                  {errors.currentPassword && (
                    <div className='form-error'>{errors.currentPassword}</div>
                  )}
                </div>
                <div className='form-group'>
                  <label className='label label-required'>New Password</label>
                  <input
                    type='password'
                    name='newPassword'
                    className={`input ${errors.newPassword ? "input-error" : ""}`}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder='Enter new password'
                  />
                  {errors.newPassword && (
                    <div className='form-error'>{errors.newPassword}</div>
                  )}
                  <div className='form-hint'>Must be at least 8 characters</div>
                </div>
                <div className='form-group'>
                  <label className='label label-required'>
                    Confirm New Password
                  </label>
                  <input
                    type='password'
                    name='confirmPassword'
                    className={`input ${errors.confirmPassword ? "input-error" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder='Confirm new password'
                  />
                  {errors.confirmPassword && (
                    <div className='form-error'>{errors.confirmPassword}</div>
                  )}
                </div>
                <div className='modal-actions'>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary'>
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
