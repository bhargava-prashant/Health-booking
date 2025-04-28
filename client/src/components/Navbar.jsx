import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <Link to="/patient/dashboard" className="mr-4">Dashboard</Link>
      <Link to="/login" className="mr-4">Login</Link>
    </nav>
  );
};

export default Navbar;
