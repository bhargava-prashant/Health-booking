import {
    fetchAllBookings,
    insertBooking,
    removeBooking
  } from '../models/bookingModel.js';
  
  // Fetch all bookings for a specific patient
  export const getAllBookings = async (req, res) => {
    const { patient_id } = req.params;
  
    if (!patient_id) {
      return res.status(400).json({ msg: 'Patient ID is required' });
    }
  
    try {
      const result = await fetchAllBookings(patient_id);
      res.status(200).json(result.rows || []);
    } catch (err) {
      res.status(500).json({ msg: 'Error fetching bookings', error: err.message });
    }
  };
  
  // Create a new booking for a patient
  export const createBooking = async (req, res) => {
    const { patient_id, doctor_id, date, time } = req.body;
  
    if (!patient_id || !doctor_id || !date || !time) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
  
    try {
      const newBooking = await insertBooking(patient_id, doctor_id, date, time);
      res.status(201).json({ msg: 'Booking created successfully', booking: newBooking.rows[0] });
    } catch (err) {
      res.status(500).json({ msg: 'Error creating booking', error: err.message });
    }
  };
  
  // Delete a specific booking for a patient
  export const deleteBooking = async (req, res) => {
    const { patient_id, doctor_id, date, time } = req.body;
  
    if (!patient_id || !doctor_id || !date || !time) {
      return res.status(400).json({ msg: 'All fields are required to delete a booking' });
    }
  
    try {
      const result = await removeBooking(patient_id, doctor_id, date, time);
      if (result.rowCount === 0) {
        return res.status(404).json({ msg: 'Booking not found' });
      }
      res.status(200).json({ msg: 'Booking removed successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Error removing booking', error: err.message });
    }
  };
  