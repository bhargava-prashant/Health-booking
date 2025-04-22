import pool from "../db.js";
export const fetchAllBookings = async (patient_id) => {
    return await pool.query(
      'SELECT * FROM bookings WHERE patient_id = $1 ORDER BY date, time',
      [patient_id]
    );
  };
  
  export const insertBooking = async (patient_id, doctor_id, date, time) => {
    return await pool.query(
      'INSERT INTO bookings (patient_id, doctor_id, date, time, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patient_id, doctor_id, date, time, 'scheduled']
    );
  };
  
  export const removeBooking = async (patient_id, doctor_id, date, time) => {
    return await pool.query(
      'DELETE FROM bookings WHERE patient_id = $1 AND doctor_id = $2 AND date = $3 AND time = $4',
      [patient_id, doctor_id, date, time]
    );
  };
  