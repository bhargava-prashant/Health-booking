import express from 'express';
import { getAllBookings, createBooking, deleteBooking } from './controllers/bookingController.js';

const router = express.Router();

// Get all bookings for a specific patient
router.get('/:patient_id', getAllBookings);

// Create a new booking for a patient
router.post('/', createBooking);

// Delete a specific booking for a patient
router.delete('/', deleteBooking);

export default router;
