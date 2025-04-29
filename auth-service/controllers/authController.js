// import pool from '../models/db.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import validator from 'validator';

// export const register = async (req, res) => {
//   const { email, name, age, password, role, date_of_birth, gender, medical_history, insurance_number } = req.body;

//   if (!validator.isEmail(email)) {
//     return res.status(400).json({ msg: 'Invalid email format' });
//   }

//   try {
//     // Check if user already exists
//     const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (userCheck.rows.length > 0) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     const hashed = await bcrypt.hash(password, 10);

//     // Extract name
//     const firstName = name?.split(' ')[0] || '';
//     const lastName = name?.split(' ')[1] || '';

//     // Step 1: Insert into users table
//     const userResult = await pool.query(
//       `INSERT INTO users (first_name, last_name, email, phone, role, password_hash)
//        VALUES ($1, $2, $3, $4, $5, $6)
//        RETURNING user_id`,
//       [firstName, lastName, email, '0000000000', role, hashed]
//     );

//     const userId = userResult.rows[0].user_id;

//     // Step 2: Insert into patients table
//     await pool.query(
//       `INSERT INTO patients (user_id, date_of_birth, gender, medical_history, insurance_number)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [userId, date_of_birth, gender, medical_history, insurance_number]
//     );

//     res.status(201).json({ msg: 'Patient registered successfully', user_id: userId });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// // LOGIN
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!validator.isEmail(email)) {
//     return res.status(400).json({ msg: 'Invalid email format' });
//   }

//   try {
//     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (result.rows.length === 0) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const user = result.rows[0];
//     const match = await bcrypt.compare(password, user.password_hash);
//     if (!match) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: user.user_id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ msg: 'Login successful', token });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };

// // PROFILE
// export const profile = async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone, p.date_of_birth, p.gender, p.medical_history, p.insurance_number
//        FROM users u
//        JOIN patients p ON u.user_id = p.user_id
//        WHERE u.user_id = $1`,
//       [req.user.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ msg: 'Patient not found' });
//     }

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error('Profile error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };



import pool from '../models/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

export const register = async (req, res) => {
  const { email, name, age, password, role, date_of_birth, gender, medical_history, insurance_number } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Extract name
    const firstName = name?.split(' ')[0] || '';
    const lastName = name?.split(' ')[1] || '';

    // Step 1: Insert into users table
    const userResult = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_id`,
      [firstName, lastName, email, '0000000000', role, hashed]
    );

    const userId = userResult.rows[0].user_id;
    console.log('User inserted with user_id:', userId); // Log the user_id for debugging

    // Verify if user data is entered successfully
    const verifyUser = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
    if (verifyUser.rows.length === 0) {
      console.log('User verification failed'); // Log verification failure
      return res.status(400).json({ msg: 'User insertion failed' });
    }

    console.log('User data verified:', verifyUser.rows[0]);

    // Step 2: Insert into patients table
    const patientResult = await pool.query(
      `INSERT INTO patients (user_id, date_of_birth, gender, medical_history, insurance_number)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, date_of_birth, gender, medical_history, insurance_number]
    );

    // Verify if patient data is entered successfully
    const verifyPatient = await pool.query('SELECT * FROM patients WHERE user_id = $1', [userId]);
    if (verifyPatient.rows.length === 0) {
      console.log('Patient verification failed'); // Log verification failure
      return res.status(400).json({ msg: 'Patient insertion failed' });
    }

    console.log('Patient data verified:', verifyPatient.rows[0]);

    res.status(201).json({ msg: 'Patient registered successfully', user_id: userId });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Add role to the response
    res.json({ msg: 'Login successful', token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// PROFILE
export const profile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone, p.date_of_birth, p.gender, p.medical_history, p.insurance_number
       FROM users u
       JOIN patients p ON u.user_id = p.user_id
       WHERE u.user_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
