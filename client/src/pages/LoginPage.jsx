import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Medical Appointment </h1>
      <div style={styles.formContainer}>
        <LoginForm />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f9fa',
    padding: '20px',
  },
  heading: {
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
  },
};

export default LoginPage;
