import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users'); 
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async () => {
    try {
      await axios.patch('/api/users/role', {
        user_id: selectedUserId,
        role: newRole,
      });
      alert('Role updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update role');
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <h3>Manage User Roles</h3>
      <select onChange={(e) => setSelectedUserId(e.target.value)}>
        <option>Select User</option>
        {users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            {user.username}
          </option>
        ))}
      </select>
      <select onChange={(e) => setNewRole(e.target.value)}>
        <option value="client">Client</option>
        <option value="trainer">Trainer</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleRoleChange}>Update Role</button>
    </div>
  );
};

export default AdminPage;