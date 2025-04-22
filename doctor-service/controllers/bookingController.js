import {
  fetchAllBookings,
  removeBooking,
  updateBookingStatus
} from '../models/bookingModel.js';

// Fetch all bookings for a specific doctor
export const getAllBookings = async (req, res) => {
  const { doctor_id } = req.params;

  if (!doctor_id) {
    return res.status(400).json({ msg: 'Doctor ID is required' });
  }

  try {
    const result = await fetchAllBookings(doctor_id);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching bookings', error: err.message });
  }
};

// Doctor cancels a booking
export const cancelBooking = async (req, res) => {
  const { patient_id, doctor_id, date, time } = req.body;

  if (!patient_id || !doctor_id || !date || !time) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const result = await updateBookingStatus(patient_id, doctor_id, date, time, 'cancelled');
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(200).json({ msg: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error cancelling booking', error: err.message });
  }
};

// Doctor marks a booking as completed
export const completeBooking = async (req, res) => {
  const { patient_id, doctor_id, date, time } = req.body;

  if (!patient_id || !doctor_id || !date || !time) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const result = await updateBookingStatus(patient_id, doctor_id, date, time, 'completed');
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(200).json({ msg: 'Booking marked as completed' });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating booking status', error: err.message });
  }
};

// Optional: Delete a booking entirely
export const deleteBooking = async (req, res) => {
  const { patient_id, doctor_id, date, time } = req.body;

  if (!patient_id || !doctor_id || !date || !time) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const deleted = await removeBooking(patient_id, doctor_id, date, time);
    if (deleted.rowCount === 0) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(200).json({ msg: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting booking', error: err.message });
  }
};
