import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkServices = async () => {
      try {
        const authResponse = await axios.get('health');
        const bookingResponse = await axios.get('http://localhost:5001/health');
        const doctorResponse = await axios.get('http://localhost:5002/health');
        const adminResponse = await axios.get('http://localhost:5003/health');

        if (
          authResponse.status === 200 &&
          bookingResponse.status === 200 &&
          doctorResponse.status === 200 &&
          adminResponse.status === 200
        ) {
          setStatus('All services are running smoothly!');
        } else {
          setStatus('Some services might be down.');
        }
      } catch (error) {
        setStatus('Error: Unable to reach one or more services.');
      }
    };

    checkServices();
  }, []);

  return (
    <div>
      <h1>Health Booking App</h1>
      <p>{status}</p>
    </div>
  );
};

export default App;
