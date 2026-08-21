import React, { useState } from "react";

function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      joined: "2024-01-10",
      incidents: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      status: "active",
      joined: "2024-01-05",
      incidents: 12,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "user",
      status: "active",
      joined: "2024-01-12",
      incidents: 3,
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "user",
      status: "inactive",
      joined: "2024-01-08",
      incidents: 7,
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "user",
      status: "active",
      joined: "2024-01-15",
      incidents: 2,
    },
    {
      id: 6,
      name: "Sarah Parker",
      email: "sarah@example.com",
      role: "admin",
      status: "active",
      joined: "2024-01-03",
      incidents: 8,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role) => {
    return role === "admin" ? "status-badge-resolved" : "status-badge-pending";
  };

  const getStatusBadgeClass = (status) => {
    return status === "active"
      ? "status-badge-resolved"
      : "status-badge-rejected";
  };

  return (
    <div className='admin-users-page'>
      <div className='page-header'>
        <h1 className='heading-2'>Manage Users</h1>
        <p className='body-small text-muted'>View and manage user accounts</p>
      </div>

      <div className='admin-toolbar'>
        <div className='admin-toolbar-left'>
          <input
            type='text'
            className='input'
            placeholder='Search by name or email...'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className='admin-toolbar-right'>
          <select
            className='input'
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value='All'>All Roles</option>
            <option value='admin'>Admin</option>
            <option value='user'>User</option>
          </select>
          <button className='btn btn-primary'>Add User</button>
        </div>
      </div>

      <div className='admin-table-wrapper'>
        <div className='card'>
          <div className='admin-table-responsive'>
            {filteredUsers.length === 0 ? (
              <div className='empty-state'>
                <p className='body-text text-muted'>No users found.</p>
              </div>
            ) : (
              <table className='admin-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Incidents</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`status-badge ${getRoleBadgeClass(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusBadgeClass(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>{user.incidents}</td>
                      <td>{new Date(user.joined).toLocaleDateString()}</td>
                      <td>
                        <button className='btn btn-sm btn-secondary'>
                          Edit
                        </button>
                        <button
                          className='btn btn-sm btn-danger'
                          style={{ marginLeft: "0.5rem" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
