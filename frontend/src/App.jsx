import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [userInfo, setUserInfo] = useState({
    id: uuid(),
    name: "",
    age: "",
    email: "",
    phone: ""
  });

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((currInfo) => ({
      ...currInfo,
      [name]: value
    }));
  };

  const addData = async () => {
    if (!userInfo.name || !userInfo.age || !userInfo.email || !userInfo.phone) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users', userInfo);
      setUsers((currUsers) => [...currUsers, response.data]);
      resetForm();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const updateData = async () => {
    console.log("Updating user with ID:", editUserId);
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${editUserId}`, userInfo);
      setUsers((currUsers) =>
        currUsers.map((user) =>
          user.id === editUserId ? response.data : user
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const editUser = (user) => {
    setIsEditing(true);
    setEditUserId(user._id);  // Assuming _id is from the database
    setUserInfo(user);
  };

  const cancelEdit = () => {
    resetForm();
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers((currUsers) => currUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const resetForm = () => {
    setUserInfo({
      id: uuid(),
      name: "",
      age: "",
      email: "",
      phone: ""
    });
    setIsEditing(false);
    setEditUserId(null);
  };

  return (
    <div className='container'>
      <div className='form'>
        <input type="text" placeholder="Enter your name:" value={userInfo.name} name="name" onChange={handleChange} />
        <br />
        <input type="number" placeholder="Enter your age:" value={userInfo.age} name="age" onChange={handleChange} />
        <br />
        <input type="email" placeholder="Enter your email:" value={userInfo.email} name="email" onChange={handleChange} />
        <br />
        <input type="number" placeholder="Enter your phone" value={userInfo.phone} name="phone" onChange={handleChange} />
        <br />
        {isEditing ? (
          <>
            <button type='button' onClick={updateData}>Update</button>
            <button type='button' onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <button type='button' onClick={addData}>Add</button>
        )}
      </div>
      <div className='dataTable'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <div className='buttonContainer'>
                    <button onClick={() => editUser(user)}>Edit</button>
                    <button onClick={() => deleteUser(user._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
