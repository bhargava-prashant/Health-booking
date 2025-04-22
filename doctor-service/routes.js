import express from 'express';
import {
  getAllBookings,
  deleteBooking,
  cancelBooking,
  completeBooking
} from './controllers/bookingController.js';

const router = express.Router();

// Get all bookings for a specific doctor
// Example: GET /bookings/doctor/:doctor_id
router.get('/doctor/:doctor_id', getAllBookings);

// Cancel a booking
// Example: PUT /bookings/cancel/:doctor_id/:patient_id/:date/:time
router.put('/cancel/:doctor_id/:patient_id/:date/:time', cancelBooking);

// Complete a booking
// Example: PUT /bookings/complete/:doctor_id/:patient_id/:date/:time
router.put('/complete/:doctor_id/:patient_id/:date/:time', completeBooking);

// Delete a booking
// Example: DELETE /bookings/:doctor_id/:patient_id/:date/:time
router.delete('/:doctor_id/:patient_id/:date/:time', deleteBooking);

export default router;
