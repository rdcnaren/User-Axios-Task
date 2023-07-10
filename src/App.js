import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
      setIsError(true);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      try {
        const response = await axios.put(
          `https://jsonplaceholder.typicode.com/users/${editingUserId}`,
          formData
        );

        setUsers(users.map((user) => (user.id === editingUserId ? response.data : user)));
        setFormData({ name: '', email: '' });
        setEditMode(false);
        setEditingUserId(null);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
        setUsers([...users, response.data]);
        setFormData({ name: '', email: '' });
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditMode(true);
    setEditingUserId(user.id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', email: '' });
    setEditMode(false);
    setEditingUserId(null);
  };

  return (
    <div className="container">
      <h1 style={{color:"grey"}}>User App</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {editMode ? (
          <div>
            <button className="submit-button">Update </button>
            <button className="cancel-edit" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="Add-user">Add User</button>
        )}
      </form>

      {isError && <p className="error">Error fetching users. Please try again later.</p>}

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li className="user" key={user.id}>
              <div className="user-info">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
              <div>
                <button className="edit-button" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
