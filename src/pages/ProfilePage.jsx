import React from "react";
import { useSelector } from "react-redux";
import { LogoutIcon, ArrowIcon } from "../components/icons";

export const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(user?.full_name);

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
          <div className='profile-menu-item'>
            <span>Edit Profile</span>
            <span className='profile-menu-arrow'>
              <ArrowIcon color='var(--color-ink-muted)' size={16} />
            </span>
          </div>
          <div className='profile-menu-item'>
            <span>Change Password</span>
            <span className='profile-menu-arrow'>
              <ArrowIcon color='var(--color-ink-muted)' size={16} />
            </span>
          </div>
          <div className='profile-menu-item'>
            <span>Notification Preferences</span>
            <span className='profile-menu-arrow'>
              <ArrowIcon color='var(--color-ink-muted)' size={16} />
            </span>
          </div>
          <div className='divider'></div>
          <div className='profile-menu-item danger'>
            <span>Deactivate Account</span>
            <span className='profile-menu-arrow'>
              <ArrowIcon color='var(--color-red)' size={16} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
