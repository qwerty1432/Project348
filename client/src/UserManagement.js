// client/src/UserManagement.js
import React, { useState, useEffect } from "react";

function UserManagement() {
  const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [API]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      let res, result;
      if (editingUser) {
        res = await fetch(`${API}/api/users/${editingUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });
        result = await res.json();
        setUsers(users.map((u) => (u._id === result._id ? result : u)));
        setEditingUser(null);
      } else {
        res = await fetch(`${API}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });
        result = await res.json();
        setUsers([...users, result]);
      }
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding/updating user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h1 className="mb-3">User Management</h1>

        <ul className="list-group mb-3">
          {users.map((user) => (
            <li
              key={user._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {user.name} — {user.email}
              <div>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            {editingUser ? "Update User" : "Add User"}
          </button>
          {editingUser && (
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default UserManagement;
