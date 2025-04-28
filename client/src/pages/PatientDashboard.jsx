import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

const PatientDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ doctor_id: '', date: '', time: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout function from auth context
  
  const API_BOOKINGS_URL = 'http://localhost:5001/api/bookings';
  const API_DOCTORS_URL = 'http://localhost:5003/api/admin/doctors';
  const API_USERS_URL = 'http://localhost:5003/api/admin/users';

  // Checking if user is authenticated and has 'patient' role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const patient_id = localStorage.getItem('userId');
    
    if (token && patient_id) {
      fetchData(patient_id, token);
    }
  }, []); 

  const fetchData = async (patient_id, token) => {
    setLoading(true);
    try {
      const [usersResponse, doctorsResponse, bookingsResponse] = await Promise.all([
        axios.get(API_USERS_URL, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(API_DOCTORS_URL, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:5003/api/admin/bookings/patient/${patient_id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        })
      ]);
  
      const usersData = usersResponse.data;
      const doctorsData = doctorsResponse.data;
      const bookingsData = bookingsResponse.data;
  
      setUsers(usersData);
  
      const mappedDoctors = doctorsData.map(doc => {
        const user = usersData.find(u => u.user_id === doc.user_id);
        return { 
          ...doc, 
          doctor_name: user ? `${user.first_name} ${user.last_name}` : 'Unknown Doctor' 
        };
      });
      setDoctors(mappedDoctors);
  
      const mappedBookings = bookingsData.map(booking => {
        const doctor = mappedDoctors.find(doc => doc.doctor_id === booking.doctor_id);
        return {
          ...booking,
          doctor_name: doctor ? doctor.doctor_name : 'Unknown Doctor'
        };
      });
      setBookings(mappedBookings);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const patient_id = localStorage.getItem('userId');

    try {
      await axios.post(`${API_BOOKINGS_URL}/`, {
        patient_id,
        ...form
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Booking created successfully!');
      setForm({ doctor_id: '', date: '', time: '' });
      fetchData(patient_id, token); // Refresh bookings
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to book appointment');
    }
  };

  const deleteBooking = async (booking) => {
    const token = localStorage.getItem('token');
    const patient_id = localStorage.getItem('userId');

    try {
      await axios.delete(`${API_BOOKINGS_URL}/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { patient_id, doctor_id: booking.doctor_id, date: booking.date, time: booking.time }
      });

      alert('Booking cancelled successfully!');
      fetchData(patient_id, token); // Refresh bookings
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to cancel booking');
    }
  };

  const handleLogout = async () => {
    try {
      // Use the logout function from context if available
      if (logout) {
        await logout();
      } else {
        // Fallback to manual logout
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
      
      // Use setTimeout to give the auth state time to update before navigating
      setTimeout(() => {
        navigate('/login');
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Patient Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>New Booking</h2>
        <select
          name="doctor_id"
          value={form.doctor_id}
          onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
          required
          style={styles.input}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.doctor_id} value={doctor.doctor_id}>
              {doctor.doctor_name} - {doctor.specialty}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Book Appointment</button>
      </form>

      <div style={styles.list}>
        <h2>Your Appointments</h2>
        {loading ? (
          <p>Loading your appointments...</p>
        ) : bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          bookings.map((b, i) => (
            <div key={i} style={styles.bookingCard}>
              <p><strong>Doctor:</strong> {b.doctor_name}</p>
              <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {b.time}</p>
              <p><strong>Status:</strong> {b.status}</p>
              <button style={styles.deleteBtn} onClick={() => deleteBooking(b)}>Cancel</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    color: '#333'
  },
  logoutButton: {
    background: '#e74c3c',
    color: '#fff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  form: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: 'auto',
    marginBottom: '3rem'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    background: '#4CAF50',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  list: {
    maxWidth: '800px',
    margin: 'auto'
  },
  bookingCard: {
    background: '#fff',
    marginBottom: '1rem',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
    position: 'relative'
  },
  deleteBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: '#e74c3c',
    color: '#fff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default PatientDashboard;