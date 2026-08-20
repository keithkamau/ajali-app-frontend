import React from "react";
import { useSelector } from "react-redux";
import { LogoutIcon } from "../components/icons";

export const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <div className='profile-avatar'>
          {user?.full_name?.charAt(0) || "U"}
        </div>
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
            <span>→</span>
          </div>
          <div className='profile-menu-item'>
            <span>Change Password</span>
            <span>→</span>
          </div>
          <div className='profile-menu-item'>
            <span>Notification Preferences</span>
            <span>→</span>
          </div>
          <div className='divider'></div>
          <div className='profile-menu-item danger'>
            <span>Deactivate Account</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
