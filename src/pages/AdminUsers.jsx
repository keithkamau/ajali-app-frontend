import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserRole,
  deleteUser,
  clearSuccess,
  clearError,
} from "../redux/slices/adminSlice";
import "./AdminPages.css";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error, success } = useSelector(
    (state) => state.admin,
  );
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setMessage(success);
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      setMessage(
        typeof error === "string"
          ? error
          : error?.message || "An error occurred",
      );
      const timer = setTimeout(() => {
        dispatch(clearError());
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleRoleChange = async (userId, role) => {
    await dispatch(updateUserRole({ userId, role }));
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${userName || "this user"}"? This action cannot be undone.`,
      )
    ) {
      await dispatch(deleteUser(userId));
    }
  };

  if (isLoading) {
    return (
      <div className='admin-loading'>
        <div className='spinner'></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className='admin-page'>
      <div className='admin-header'>
        <h1 className='page-title'>Users</h1>
        <p className='page-subtitle'>Manage all registered users</p>
      </div>

      {message && (
        <div
          className={`profile-message ${message.includes("error") || message.includes("failed") ? "profile-message-error" : "profile-message-success"}`}
        >
          {message}
        </div>
      )}

      <div className='admin-user-list'>
        {users?.length === 0 ? (
          <div className='empty-state'>
            <p>No users found</p>
          </div>
        ) : (
          <div className='admin-user-grid'>
            {users?.map((user) => (
              <div key={user.id} className='admin-user-card'>
                <div className='admin-user-header'>
                  <div className='admin-user-avatar'>
                    {user.full_name ? (
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
                  <div className='admin-user-info'>
                    <h4>{user.full_name || "User"}</h4>
                    <p>{user.email}</p>
                  </div>
                  <span
                    className={`badge badge-${user.role === "admin" ? "admin" : "user"}`}
                  >
                    {user.role || "user"}
                  </span>
                </div>
                <div className='admin-user-details'>
                  <span>Phone: {user.phone_number || "N/A"}</span>
                  <span>•</span>
                  <span>
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>Status: {user.is_active ? "Active" : "Inactive"}</span>
                </div>
                <div className='admin-user-actions'>
                  <button
                    className='btn btn-primary btn-sm'
                    onClick={() => setSelectedUser(user.id)}
                  >
                    Manage
                  </button>
                  <button
                    className='btn btn-danger btn-sm'
                    onClick={() => handleDeleteUser(user.id, user.full_name)}
                  >
                    Delete
                  </button>
                </div>

                {selectedUser === user.id && (
                  <div className='admin-user-manage'>
                    <label className='label'>Change Role</label>
                    <select
                      className='input'
                      defaultValue={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                    >
                      <option value='user'>User</option>
                      <option value='admin'>Admin</option>
                    </select>
                    <button
                      className='btn btn-secondary btn-sm'
                      onClick={() => setSelectedUser(null)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
