import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserManagement.css";
import {
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
} from "../../api/admin_api";

function UserManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();

      const userList = data.results || data;

      setUsers(userList);
    } catch (error) {
      console.error("Failed to load users:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(id, newRole) {
    try {
      const updatedUser = await updateUserRole(
        id,
        newRole
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id
            ? {
                ...user,
                ...updatedUser,
                role: updatedUser.role || newRole,
              }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to update role:", error);

      alert(
        error.response?.data?.detail ||
          "Failed to update user role."
      );
    }
  }

  async function handleStatusToggle(id, currentStatus) {
    const newStatus = !currentStatus;

    try {
      const updatedUser = await updateUserStatus(
        id,
        newStatus
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id
            ? {
                ...user,
                ...updatedUser,
                is_active:
                  updatedUser.is_active ?? newStatus,
              }
            : user
        )
      );
    } catch (error) {
      console.error(
        "Failed to update user status:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to update user status."
      );
    }
  }

  function formatRole(role) {
    if (role === "admin") {
      return "Admin";
    }

    return "User";
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const name = (
      user.full_name || ""
    ).toLowerCase();

    const email = (
      user.email || ""
    ).toLowerCase();

    const phone = user.phone_number || "";

    const matchesSearch =
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue);

    const formattedRole = formatRole(user.role);

    const matchesRole =
      roleFilter === "All" ||
      formattedRole === roleFilter;

    const userStatus =
      user.is_active ? "Active" : "Inactive";

    const matchesStatus =
      statusFilter === "All" ||
      userStatus === statusFilter;

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus
    );
  });

  if (loading) {
    return (
      <div className="user-management">
        <div className="user-management-header">
          <div>
            <h1>User Management</h1>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // ERROR

  if (error) {
    return (
      <div className="user-management">
        <div className="user-management-header">
          <div>
            <h1>User Management</h1>
            <p>{error}</p>

            <button
              className="manage-btn"
              onClick={loadUsers}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">

      <div className="user-management-header">
        <div>
          <h1>User Management</h1>

          <p>
            Manage registered users, roles and
            account status.
          </p>
        </div>

        <div className="user-count">
          {filteredUsers.length} users
        </div>
      </div>


      <div className="user-filters">

        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value)
          }
        >
          <option value="All">
            All Roles
          </option>

          <option value="User">
            User
          </option>

          <option value="Admin">
            Admin
          </option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

      </div>


      <div className="users-table-container">

        <table className="users-table">

          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => {

              const isActive =
                user.is_active;

              return (
                <tr key={user.id}>

                  {/* USER */}

                  <td>
                    <div className="user-info">

                      <div className="user-avatar">
                        {(
                          user.full_name ||
                          user.email ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {user.full_name ||
                            "Unnamed User"}
                        </strong>

                        <span>
                          {user.email}
                        </span>

                      </div>

                    </div>
                  </td>

                  {/* PHONE */}

                  <td>
                    {user.phone_number || "—"}
                  </td>

                  {/* ROLE */}

                  <td>

                    <select
                      className="role-select"
                      value={user.role}
                      onChange={(event) =>
                        handleRoleChange(
                          user.id,
                          event.target.value
                        )
                      }
                    >

                      <option value="user">
                        User
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                    </select>

                  </td>

                  {/* STATUS */}

                  <td>

                    <span
                      className={`user-status ${
                        isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  {/* JOINED */}

                  <td>
                    {formatDate(
                      user.created_at
                    )}
                  </td>

                  {/* ACTIONS */}

                  <td>

                    <div className="user-actions">

                      <button
                        className="manage-btn"
                        onClick={() =>
                          navigate(
                            `/admin/users/${user.id}`
                          )
                        }
                      >
                        View
                      </button>

                      <button
                        className="toggle-btn"
                        onClick={() =>
                          handleStatusToggle(
                            user.id,
                            isActive
                          )
                        }
                      >
                        {isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

        {filteredUsers.length === 0 && (
          <div className="no-users">
            No users found.
          </div>
        )}

      </div>

    </div>
  );
}

export default UserManagement;