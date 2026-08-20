import { useState } from "react";
import "./AdminSettingsPage.css";

function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Admin User",
    email: "admin@ajali.co.ke",
    phone: "+254 700 000 000",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswords((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleProfileSubmit(event) {
    event.preventDefault();

    setProfileMessage(
      "Profile changes saved successfully."
    );

    setTimeout(() => {
      setProfileMessage("");
    }, 3000);
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setPasswordMessage(
        "Please fill in all password fields."
      );
      return;
    }

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      setPasswordMessage(
        "New passwords do not match."
      );
      return;
    }

    setPasswordMessage(
      "Password updated successfully."
    );

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      setPasswordMessage("");
    }, 3000);
  }

  return (
    <div className="admin-settings-page">

      {/* Page Header */}

      <div className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>
            Manage your administrator account and
            security settings.
          </p>
        </div>
      </div>

      {/* Profile Settings */}

      <section className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>Profile Settings</h2>

            <p>
              Update your administrator profile
              information.
            </p>
          </div>
        </div>

        <form
          className="settings-form"
          onSubmit={handleProfileSubmit}
        >

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={profile.fullName}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="+254..."
              />
            </div>

          </div>

          {profileMessage && (
            <div className="success-message">
              {profileMessage}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
            >
              Save Changes
            </button>
          </div>

        </form>
      </section>

      {/* Security */}

      <section className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>Security</h2>

            <p>
              Update your administrator password.
            </p>
          </div>
        </div>

        <form
          className="settings-form"
          onSubmit={handlePasswordSubmit}
        >

          <div className="form-group">
            <label htmlFor="currentPassword">
              Current Password
            </label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="newPassword">
                New Password
              </label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>

          </div>

          {passwordMessage && (
            <div
              className={
                passwordMessage.includes(
                  "successfully"
                )
                  ? "success-message"
                  : "error-message"
              }
            >
              {passwordMessage}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
            >
              Update Password
            </button>
          </div>

        </form>
      </section>

    </div>
  );
}

export default AdminSettingsPage;