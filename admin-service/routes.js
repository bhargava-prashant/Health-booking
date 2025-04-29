import express from 'express';
import {
  getBookingsByPatientId,
  getBookingsByDoctorId,
  deleteBooking,
  registerDoctor,
  getUsersData,
  getDoctorsData,
  removeDoctor,
  getUserById,
  UserById
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
router.get('/users/:user_id',UserById)
router.get('/doctors', getDoctorsData);

// **NEW: User By ID Route**
router.get('/user/:user_id', getUserById);

export default router;
