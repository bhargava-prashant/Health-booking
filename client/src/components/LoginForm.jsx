import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      console.log('Attempting login with:', form.email);
      const result = await login(form.email, form.password);
      
      if (!result.success) {
        setError(result.message);
        return;
      }
      
      console.log('Login successful as role:', result.role);
      
      // Navigate based on role
      switch (result.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const styles = {
    loginContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: '#e8f0f2',
    },
    form: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    h2: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1rem',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s',
      opacity: isLoading ? 0.7 : 1,
    },
    a: {
      color: '#007bff',
      textDecoration: 'none',
      fontSize: '0.9rem',
    },
    p: {
      fontSize: '0.9rem',
      marginTop: '1rem',
      color: '#777',
    },
    error: {
      color: '#e74c3c',
      marginBottom: '1rem',
      fontSize: '0.9rem',
    }
  };

  return (
    <div style={styles.loginContainer}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.h2}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
          required
          autoComplete="email"
          disabled={isLoading}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
          required
          autoComplete="current-password"
          disabled={isLoading}
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#45a049')}
          onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#4CAF50')}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.p}>
          <Link to="/register" style={styles.a}>
            Don't have an account? Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;