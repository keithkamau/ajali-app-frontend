import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./UserManagement.css";

function UserManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Kamau",
      email: "john@example.com",
      phone: "0712345678",
      role: "Citizen",
      status: "Active",
      joined: "12 August 2026",
    },
    {
      id: 2,
      name: "Mary",
      email: "mary@example.com",
      phone: "0712345678",
      role: "Citizen",
      status: "Active",
      joined: "10 May 2025",
    },
    {
      id: 3,
      name: "David Otieno",
      email: "david@example.com",
      phone: "0712345678",
      role: "Responder",
      status: "Active",
      joined: "08 July 2025",
    },
    {
      id: 4,
      name: "Jane",
      email: "jane@example.com",
      phone: "0712345678",
      role: "Citizen",
      status: "Inactive",
      joined: "05 January 2024",
    },
    {
      id: 5,
      name: "Admin User",
      email: "admin@ajali.com",
      phone: "0712345678",
      role: "Admin",
      status: "Active",
      joined: "01 October 2026",
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue) ||
      user.phone.includes(searchValue);

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  function handleRoleChange(id, newRole) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? { ...user, role: newRole }
          : user
      )
    );

    // Later:
    // PUT /api/admin/users/{id}/role
  }

  function handleStatusToggle(id) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );

    // Later:
    // API request to activate/deactivate user
  }

  return (
    <div className="user-management">
      {/* Header */}
      <div className="user-management-header">
        <div>
          <h1>User Management</h1>
          <p>
            Manage registered users, roles and account status.
          </p>
        </div>

        <div className="user-count">
          {filteredUsers.length} users
        </div>
      </div>

      {/* Filters */}
      <div className="user-filters">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value)
          }
        >
          <option value="All">All Roles</option>
          <option value="Citizen">Citizen</option>
          <option value="Responder">Responder</option>
          <option value="Admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Users table */}
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
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>

                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>
                </td>

                <td>{user.phone}</td>

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
                    <option value="Citizen">Citizen</option>
                    <option value="Responder">
                      Responder
                    </option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>

                <td>
                  <span
                    className={`user-status ${
                      user.status.toLowerCase()
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td>{user.joined}</td>

                <td>
                  <div className="user-actions">
                    <button
                      className="manage-btn"
                      onClick={() =>
                        navigate(`/admin/users/${user.id}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className="toggle-btn"
                      onClick={() =>
                        handleStatusToggle(user.id)
                      }
                    >
                      {user.status === "Active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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