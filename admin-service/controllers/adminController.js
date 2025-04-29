import { 
    fetchBookingsByPatientId, 
    fetchBookingsByDoctorId, 
    removeBooking,
    registerDoctorInDb,
    fetchAllUsers,
    fetchAllDoctors,
    removeDoctorFromDb,
    fetchUserById,
    fetchuserById
} from '../models/adminModel.js';

// Error handling function
const handleError = (res, error, msg) => {
    res.status(500).json({ msg, error: error.message });
};

// Get bookings by patient_id
export const getBookingsByPatientId = async (req, res) => {
    const { patient_id } = req.params;
    try {
        const result = await fetchBookingsByPatientId(patient_id); // already rows
        res.status(200).json(result); // send result directly, not result.rows
    } catch (err) {
        handleError(res, err, 'Error fetching bookings by patient ID');
    }
};


// Get bookings by doctor_id
export const getBookingsByDoctorId = async (req, res) => {
    const { doctor_id } = req.params;
    try {
        const result = await fetchBookingsByDoctorId(doctor_id);
        res.status(200).json(result.rows);
    } catch (err) {
        handleError(res, err, 'Error fetching bookings by doctor ID');
    }
};

// Delete booking
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
        handleError(res, err, 'Error deleting booking');
    }
};

export const getUserById = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ msg: 'User ID is required' });
    }

    try {
        const result = await fetchUserById(user_id);
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        handleError(res, err, 'Error fetching user by ID');
    }
};

export const UserById = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ msg: 'User ID is required' });
    }

    try {
        const result = await fetchuserById(user_id);
        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        handleError(res, err, 'Error fetching user by ID');
    }
};

// Register a doctor
export const registerDoctor = async (req, res) => {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      specialty,
      qualifications,
      clinic_address,
      available_date,
      available_day,
      available_time
    } = req.body;

    if (!first_name || !last_name || !email || !phone || !password || !specialty || !available_date || !available_day || !available_time) {
      return res.status(400).json({ msg: 'All doctor details are required' });
    }

    try {
      const newDoctor = await registerDoctorInDb(
        first_name,
        last_name,
        email,
        phone,
        password,
        specialty,
        qualifications,
        clinic_address,
        available_date,
        available_day,
        available_time
      );
      res.status(201).json(newDoctor);
    } catch (err) {
      handleError(res, err, 'Error registering doctor');
    }
};

// Get all users data
export const getUsersData = async (req, res) => {
    try {
        const result = await fetchAllUsers();
        res.status(200).json(result.rows);
    } catch (err) {
        handleError(res, err, 'Error fetching users data');
    }
};

// Get all doctors data
export const getDoctorsData = async (req, res) => {
    try {
        const result = await fetchAllDoctors();
        res.status(200).json(result.rows);
    } catch (err) {
        handleError(res, err, 'Error fetching doctors data');
    }
};

// Delete doctor
export const removeDoctor = async (req, res) => {
    const { doctor_id } = req.params;

    if (!doctor_id) {
        return res.status(400).json({ msg: 'Doctor ID is required' });
    }

    try {
        const deleted = await removeDoctorFromDb(doctor_id);
        if (deleted.rowCount === 0) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }
        res.status(200).json({ msg: 'Doctor deleted successfully' });
    } catch (err) {
        handleError(res, err, 'Error deleting doctor');
    }
};
