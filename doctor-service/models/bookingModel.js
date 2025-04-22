import pool from '../db.js';

// Get all bookings for a specific doctor
export const fetchAllBookings = (doctor_id) => {
  return pool.query('SELECT * FROM bookings WHERE doctor_id = $1 ORDER BY date, time', [doctor_id]);
};

// Delete booking
export const removeBooking = (patient_id, doctor_id, date, time) => {
  return pool.query(
    'DELETE FROM bookings WHERE patient_id = $1 AND doctor_id = $2 AND date = $3 AND time = $4',
    [patient_id, doctor_id, date, time]
  );
};

// Update status of a booking (cancelled/completed)
export const updateBookingStatus = (patient_id, doctor_id, date, time, status) => {
  return pool.query(
    'UPDATE bookings SET status = $5 WHERE patient_id = $1 AND doctor_id = $2 AND date = $3 AND time = $4',
    [patient_id, doctor_id, date, time, status]
  );
};
