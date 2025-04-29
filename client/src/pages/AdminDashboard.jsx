import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import Auth Context
import { useNavigate } from 'react-router-dom'; // For redirecting
import './AdminDashboard.css';

const API_BASE = 'http://localhost:5003/api/admin';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedTab, setSelectedTab] = useState('users');
  const [formData, setFormData] = useState({});
  const [bookings, setBookings] = useState([]);
  const [notification, setNotification] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear auth data
    navigate('/'); // Redirect to home or login
  };

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch {
      notify('Error fetching users', 'error');
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/doctors`);
      setDoctors(res.data);
    } catch {
      notify('Error fetching doctors', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDoctors();
  }, []);

  const handleDeleteDoctor = async (doctor_id) => {
    try {
      await axios.delete(`${API_BASE}/doctor/${doctor_id}`);
      notify('Doctor deleted successfully');
      fetchDoctors();
    } catch {
      notify('Failed to delete doctor', 'error');
    }
  };

  const handleRegisterDoctor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/register-doctor`, formData);
      notify('Doctor registered successfully');
      fetchDoctors();
    } catch (err) {
      notify(err.response?.data?.msg || 'Failed to register doctor', 'error');
    }
  };

  const handleFetchBookings = async () => {
    try {
      const id = formData.search_id;
      const res = formData.search_type === 'patient'
        ? await axios.get(`${API_BASE}/bookings/patient/${id}`)
        : await axios.get(`${API_BASE}/bookings/doctor/${id}`);
      setBookings(res.data);
    } catch {
      notify('Error fetching bookings', 'error');
    }
  };

  const handleDeleteBooking = async () => {
    try {
      await axios.delete(`${API_BASE}/bookings/`, { data: formData });
      notify('Booking deleted');
      setBookings(bookings.filter(
        b => b.patient_id !== formData.patient_id || b.date !== formData.date
      ));
    } catch {
      notify('Error deleting booking', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li><button onClick={() => setSelectedTab('users')} className="w-full text-left">Manage Users</button></li>
          <li><button onClick={() => setSelectedTab('doctors')} className="w-full text-left">Manage Doctors</button></li>
          <li><button onClick={() => setSelectedTab('register')} className="w-full text-left">Register Doctor</button></li>
          <li><button onClick={() => setSelectedTab('bookings')} className="w-full text-left">Manage Bookings</button></li>
          <li><button onClick={handleLogout} className="w-full text-left text-red-600 font-semibold">Logout</button></li>
        </ul>
      </div>

      <div className="flex-1 p-8">
        {notification && (
          <div className={`mb-4 p-3 rounded text-white ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{notification.msg}</div>
        )}

        {selectedTab === 'users' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">All Users</h3>
            <table className="min-w-full bg-white rounded shadow">
              <thead><tr>
                <th className="py-2 px-4 border">ID</th><th className="py-2 px-4 border">Name</th><th className="py-2 px-4 border">Email</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.user_id}>
                    <td className="py-2 px-4 border">{u.user_id}</td>
                    <td className="py-2 px-4 border">{u.first_name} {u.last_name}</td>
                    <td className="py-2 px-4 border">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTab === 'doctors' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">All Doctors</h3>
            <table className="min-w-full bg-white rounded shadow">
              <thead><tr>
                <th className="py-2 px-4 border">ID</th><th className="py-2 px-4 border">Specialty</th><th className="py-2 px-4 border">Actions</th>
              </tr></thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc.doctor_id}>
                    <td className="py-2 px-4 border">{doc.doctor_id}</td>
                    <td className="py-2 px-4 border">{doc.specialty}</td>
                    <td className="py-2 px-4 border">
                      <button onClick={() => handleDeleteDoctor(doc.doctor_id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTab === 'register' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Register Doctor</h3>
            <form onSubmit={handleRegisterDoctor} className="grid grid-cols-2 gap-4">
              {['first_name','last_name','email','phone','password','specialty','qualifications','clinic_address','available_date','available_day','available_time'].map(field => (
                <input key={field} type="text" required placeholder={field.replace('_',' ')}
                  className="p-2 border rounded" onChange={e => setFormData({ ...formData, [field]: e.target.value })} />
              ))}
              <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded">Register</button>
            </form>
          </div>
        )}

        {selectedTab === 'bookings' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Manage Bookings</h3>
            <div className="flex gap-2 mb-4">
              <select className="p-2 border rounded" onChange={e => setFormData({ ...formData, search_type: e.target.value })}>
                <option value="">Select Type</option>
                <option value="patient">By Patient</option>
                <option value="doctor">By Doctor</option>
              </select>
              <input type="text" placeholder="ID" className="p-2 border rounded" onChange={e => setFormData({ ...formData, search_id: e.target.value })} />
              <button onClick={handleFetchBookings} className="bg-gray-700 text-white px-3 py-1 rounded">Search</button>
            </div>
            <table className="min-w-full bg-white rounded shadow">
              <thead><tr>
                <th className="py-2 px-4 border">Booking ID</th><th className="py-2 px-4 border">Patient</th><th className="py-2 px-4 border">Doctor</th><th className="py-2 px-4 border">Date</th><th className="py-2 px-4 border">Actions</th>
              </tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.booking_id}>
                    <td className="py-2 px-4 border">{b.booking_id}</td>
                    <td className="py-2 px-4 border">{b.patient_first_name} {b.patient_last_name}</td>
                    <td className="py-2 px-4 border">{b.doctor_first_name} {b.doctor_last_name}</td>
                    <td className="py-2 px-4 border">{b.date} {b.time}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => {
                          setFormData({
                            patient_id: b.patient_id,
                            doctor_id: b.doctor_id,
                            date: b.date,
                            time: b.time
                          });
                          handleDeleteBooking();
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
