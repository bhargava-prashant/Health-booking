
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icons
import { Calendar, Clock, CheckCircle, XCircle, User, Filter, LogOut } from 'lucide-react';

const DoctorDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const API_BOOKINGS_URL = 'http://localhost:5002/api/bookings';
  const API_USERS_URL = 'http://localhost:5003/api/admin/users';
  const API_DOCTOR_URL = 'http://localhost:5003/api/admin/user';

  // Use useCallback to memoize the fetchData function
  const fetchData = useCallback(async () => {
    if (dataFetched) return; // Prevent refetching if already done
    
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('userId');
    
    if (!token || !user_id) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    console.log('Fetching data for user ID:', user_id);

    try {
      // Always fetch doctor info first to get correct doctor_id
      const doctorResponse = await axios.get(`${API_DOCTOR_URL}/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Doctor Response:', doctorResponse.data);

      // Verify user is a doctor
      if (doctorResponse.data) {
        // Store doctor information
        setDoctor(doctorResponse.data);
        localStorage.setItem('role', 'doctor');
        
        // Extract doctor_id which is the same as user_id in this case
        const doctor_id = doctorResponse.data.doctor_id;
        console.log('Doctor ID used for bookings:', doctor_id);
        
        // Get doctor's bookings using the doctor_id
        const bookingsResponse = await axios.get(`${API_BOOKINGS_URL}/doctor/${doctor_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Bookings API URL:', `${API_BOOKINGS_URL}/doctor/${doctor_id}`);
        console.log('Bookings Response:', bookingsResponse.data);
        
        // Get all users to find patient names
        const usersResponse = await axios.get(API_USERS_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const bookingsData = bookingsResponse.data;
        const mappedBookings = bookingsData.map(booking => {
          const patient = usersResponse.data.find(u => u.user_id === booking.patient_id);

          return {
            ...booking,
            id: booking.booking_id || `${booking.doctor_id}-${booking.patient_id}-${booking.date}-${booking.time}`,
            patient_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient',
            formattedDate: new Date(booking.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          };
        });

        mappedBookings.sort((a, b) => {
          const dateComparison = new Date(a.date) - new Date(b.date);
          if (dateComparison !== 0) return dateComparison;
          return a.time.localeCompare(b.time);
        });

        setBookings(mappedBookings);
      } else {
        console.warn('User is not a doctor, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching data:', error.response?.data || error.message);
      // In case of error, it's safer to clear credentials and redirect
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        navigate('/login');
      }
    } finally {
      setLoading(false);
      setDataFetched(true);
    }
  }, [API_BOOKINGS_URL, API_DOCTOR_URL, API_USERS_URL, dataFetched, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (booking, newStatus) => {
    const token = localStorage.getItem('token');
    
    // Always use doctor_id from the doctor state object
    if (!doctor || !doctor.user_id) {
      alert('Doctor information not available. Please refresh the page.');
      return;
    }
    
    const doctor_id = doctor.user_id;
    console.log('Using doctor_id for status change:', doctor_id);

    try {
      const endpoint = newStatus === 'cancelled'
        ? `${API_BOOKINGS_URL}/cancel/${doctor_id}/${booking.patient_id}/${booking.date}/${booking.time}`
        : `${API_BOOKINGS_URL}/complete/${doctor_id}/${booking.patient_id}/${booking.date}/${booking.time}`;
      
      console.log('Status change endpoint:', endpoint);

      await axios.put(endpoint, {
        patient_id: booking.patient_id,
        doctor_id,
        date: booking.date,
        time: booking.time
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Appointment marked as ${newStatus} successfully!`);
      // Update the local state instead of refetching all data
      setBookings(prevBookings => 
        prevBookings.map(b => 
          (b.id === booking.id) ? {...b, status: newStatus} : b
        )
      );
    } catch (err) {
      console.error('Status update error:', err.response?.data || err.message);
      alert('Failed to update appointment status.');
    }
  };

  const deleteBooking = async (booking) => {
    const token = localStorage.getItem('token');
    
    // Always use doctor_id from the doctor state object
    if (!doctor || !doctor.user_id) {
      alert('Doctor information not available. Please refresh the page.');
      return;
    }
    
    const doctor_id = doctor.user_id;
    console.log('Using doctor_id for deletion:', doctor_id);

    if (window.confirm('Are you sure you want to permanently delete this appointment?')) {
      try {
        const endpoint = `${API_BOOKINGS_URL}/${doctor_id}/${booking.patient_id}/${booking.date}/${booking.time}`;
        console.log('Delete endpoint:', endpoint);

        await axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Appointment deleted successfully!');
        // Update the local state instead of refetching all data
        setBookings(prevBookings => prevBookings.filter(b => b.id !== booking.id));
      } catch (err) {
        console.error('Delete error:', err.response?.data || err.message);
        alert('Failed to delete appointment.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    const dateMatch = !selectedDate || booking.date.startsWith(selectedDate);
    return statusMatch && dateMatch;
  });

  const uniqueDates = [...new Set(bookings.map(b => b.date.slice(0, 10)))].sort();

  // If still loading, show loading indicator
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading doctor dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Doctor Dashboard</h1>
          <p style={styles.subtitle}>Manage your patient appointments</p>
          {doctor && (
            <p style={styles.doctorInfo}>Dr. {doctor.first_name} {doctor.last_name} (ID: {doctor.doctor_id})</p>
          )}
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={18} style={{ marginRight: '8px' }} />
          Logout
        </button>
      </div>

      {/* Statistics */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h3>Upcoming</h3>
          <p style={styles.statNumber}>
            {bookings.filter(b => b.status === 'scheduled').length}
          </p>
        </div>
        <div style={styles.statCard}>
          <h3>Completed</h3>
          <p style={styles.statNumber}>
            {bookings.filter(b => b.status === 'completed').length}
          </p>
        </div>
        <div style={styles.statCard}>
          <h3>Cancelled</h3>
          <p style={styles.statNumber}>
            {bookings.filter(b => b.status === 'cancelled').length}
          </p>
        </div>
        <div style={styles.statCard}>
          <h3>Total</h3>
          <p style={styles.statNumber}>{bookings.length}</p>
        </div>
      </div>

      {/* Debug Information
      <div style={styles.debugContainer}>
        <h3>Debug Information</h3>
        <p>Doctor ID: {doctor ? doctor.doctor_id : 'Not loaded'}</p>
        <p>User ID from localStorage: {localStorage.getItem('userId')}</p>
        <p>Role: {doctor ? doctor.role : 'Not loaded'}</p>
        <p>API Bookings URL: {API_BOOKINGS_URL}/doctor/{doctor ? doctor.doctor_id : 'N/A'}</p>
      </div> */}

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>
            <Filter size={16} style={{ marginRight: '8px' }} />
            Filter by Status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>
            <Calendar size={16} style={{ marginRight: '8px' }} />
            Filter by Date:
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div>
        {filteredBookings.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} style={styles.bookingCard}>
              <h3>{booking.patient_name}</h3>
              <p><Clock size={16} /> {booking.formattedDate} at {booking.time}</p>
              <p><User size={16} /> Status: {booking.status}</p>

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                {booking.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(booking, 'completed')}
                      style={{ ...styles.actionButton, backgroundColor: 'green' }}
                    >
                      <CheckCircle size={16} /> Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking, 'cancelled')}
                      style={{ ...styles.actionButton, backgroundColor: 'red' }}
                    >
                      <XCircle size={16} /> Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteBooking(booking)}
                  style={{ ...styles.actionButton, backgroundColor: 'gray' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
        padding: '2rem',
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: '#f8f9fd',
        minHeight: '100vh'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      },
      headerLeft: {
        display: 'flex',
        flexDirection: 'column'
      },
      title: {
        color: '#2c3e50',
        fontSize: '2rem',
        margin: '0 0 0.5rem 0'
      },
      subtitle: {
        color: '#7f8c8d',
        margin: 0
      },
      logoutButton: {
        display: 'flex',
        alignItems: 'center',
        background: '#e74c3c',
        color: '#fff',
        padding: '10px 16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
      },
      statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      },
      statCard: {
        background: '#fff',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        textAlign: 'center'
      },
      statNumber: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0.5rem 0',
        color: '#3498db'
      },
      filtersContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      },
      filterGroup: {
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '8px',
        padding: '0.8rem 1.2rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      },
      filterLabel: {
        display: 'flex',
        alignItems: 'center',
        marginRight: '10px',
        color: '#555',
        fontSize: '0.9rem'
      },
      filterSelect: {
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '0.9rem'
      },
      appointmentsContainer: {
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      },
      sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        color: '#2c3e50',
        marginTop: 0,
        marginBottom: '1.5rem',
        fontSize: '1.5rem'
      },
      loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 0',
        color: '#7f8c8d'
      },
      spinner: {
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderTopColor: '#3498db',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
      },
      emptyState: {
        textAlign: 'center',
        padding: '3rem 0',
        color: '#7f8c8d'
      },
      appointmentsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      },
      appointmentCard: {
        background: '#fff',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease'
      },
      appointmentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      },
      patientInfo: {
        display: 'flex',
        alignItems: 'center'
      },
      patientName: {
        margin: 0,
        fontSize: '1.1rem',
        color: '#2c3e50'
      },
      statusBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '500',
        color: '#fff',
        backgroundColor: '#ccc'
      },
      appointmentDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        marginBottom: '1.2rem'
      },
      detailItem: {
        display: 'flex',
        alignItems: 'center',
        color: '#555'
      },
      appointmentActions: {
        display: 'flex',
        gap: '0.8rem',
        marginTop: '1rem',
        flexWrap: 'wrap'
      },
      actionButton: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '0.9rem',
        border: 'none',
        transition: 'all 0.2s ease'
      },
      completeButton: {
        background: '#e3f2fd',
        color: '#2196F3'
      },
      cancelButton: {
        background: '#ffebee',
        color: '#f44336'
      },
      deleteButton: {
        background: '#f5f5f5',
        color: '#757575'
      }
};

export default DoctorDashboard;