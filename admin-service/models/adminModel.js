import pool from '../db.js';
import bcrypt from 'bcrypt';
import validator from 'validator'; // Add this import for email validation

// Fetch all bookings by patient_id
export const fetchBookingsByPatientId = async (patient_id) => {
    return await pool.query('SELECT * FROM bookings WHERE patient_id = $1', [patient_id]);
};

// Fetch all bookings by doctor_id
export const fetchBookingsByDoctorId = async (doctor_id) => {
    return await pool.query('SELECT * FROM bookings WHERE doctor_id = $1', [doctor_id]);
};

// Remove a booking
export const removeBooking = async (patient_id, doctor_id, date, time) => {
    return await pool.query(
        'DELETE FROM bookings WHERE patient_id = $1 AND doctor_id = $2 AND date = $3 AND time = $4',
        [patient_id, doctor_id, date, time]
    );
};

// Register a doctor in the database
export const registerDoctorInDb = async (
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
) => {
    // Validate email format
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }

    const client = await pool.connect();
    try {
        // Check if email already exists
        const existingDoctor = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingDoctor.rowCount > 0) {
            throw new Error('Email already exists');
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert into users table
        const userResult = await client.query(
            `INSERT INTO users (first_name, last_name, email, phone, role, password_hash)
             VALUES ($1, $2, $3, $4, 'doctor', $5)
             RETURNING user_id`,
            [first_name, last_name, email, phone, password_hash]
        );

        const user_id = userResult.rows[0].user_id;

        // Insert into doctors table
        await client.query(
            `INSERT INTO doctors (user_id, specialty, qualifications, clinic_address, available_date, available_day, available_time)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [user_id, specialty, qualifications, clinic_address, available_date, available_day, available_time]
        );

        return {
            msg: 'Doctor registered successfully',
            doctor: {
                user_id,
                first_name,
                last_name,
                email,
                phone,
                specialty,
                qualifications,
                clinic_address,
                available_date,
                available_day,
                available_time
            }
        };
    } finally {
        client.release();
    }
};

// Fetch all users data
export const fetchAllUsers = async () => {
    return await pool.query('SELECT * FROM users');
};

// Fetch all doctors data
export const fetchAllDoctors = async () => {
    return await pool.query('SELECT * FROM doctors');
};

// Remove a doctor
export const removeDoctorFromDb = async (doctor_id) => {
    return await pool.query('DELETE FROM doctors WHERE doctor_id = $1', [doctor_id]);
};
