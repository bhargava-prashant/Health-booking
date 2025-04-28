import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    date_of_birth: '',
    gender: '',
    medical_history: '',
    insurance_number: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        ...form,
        role: 'patient',
      });
      alert(response.data.msg);
    } catch (error) {
      alert(error.response?.data?.msg || 'Registration failed');
    }
  };
  

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#e8f0f2',
      padding: '2rem',
    },
    form: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    h2: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1rem',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '1rem',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '1rem',
      boxSizing: 'border-box',
      height: '120px',
    },
    select: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '1rem',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
    p: {
      fontSize: '0.9rem',
      marginTop: '1rem',
      color: '#777',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.h2}>Patient Registration</h2>
        <input
  name="firstName"
  type="text"
  placeholder="First Name"
  onChange={handleChange}
  style={styles.input}
/>
<input
  name="lastName"
  type="text"
  placeholder="Last Name"
  onChange={handleChange}
  style={styles.input}
/>
<input
  name="email"
  type="email"
  placeholder="Email"
  onChange={handleChange}
  style={styles.input}
/>
<input
  name="phone"
  type="text"
  placeholder="Phone Number"
  onChange={handleChange}
  style={styles.input}
/>
<input
  name="password"
  type="password"
  placeholder="Password"
  onChange={handleChange}
  style={styles.input}
/>
<input
  name="age"
  type="number"
  placeholder="Age"
  onChange={handleChange}
  style={styles.input}
/>
<input
  name="date_of_birth"
  type="date"
  placeholder="Date of Birth"
  onChange={handleChange}
  style={styles.input}
/>
<select
  name="gender"
  onChange={handleChange}
  style={styles.input}
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>
<input
  name="medical_history"
  type="text"
  placeholder="Medical History"
  onChange={handleChange}
  style={styles.input}
/>
<input
  name="insurance_number"
  type="text"
  placeholder="Insurance Number"
  onChange={handleChange}
  style={styles.input}
/>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;