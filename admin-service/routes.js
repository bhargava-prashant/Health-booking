import express from 'express';
import {
  getBookingsByPatientId,
  getBookingsByDoctorId,
  deleteBooking,
  registerDoctor,
  getUsersData,
  getDoctorsData,
  removeDoctor
} from './controllers/adminController.js';

const router = express.Router();

// **Bookings Routes**
router.get('/bookings/patient/:patient_id', getBookingsByPatientId);
router.get('/bookings/doctor/:doctor_id', getBookingsByDoctorId);
router.delete('/bookings', deleteBooking);

// **Doctor Management Routes**
router.post('/register-doctor', registerDoctor);
router.delete('/doctor/:doctor_id', removeDoctor);

// **User Data Routes**
router.get('/users', getUsersData);
router.get('/doctors', getDoctorsData);

export default router;
