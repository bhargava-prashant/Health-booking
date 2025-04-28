import React from 'react';

const PatientCard = ({ patient }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">{patient.first_name} {patient.last_name}</h2>
      <p>Age: {patient.age}</p>
      <p>Email: {patient.email}</p>
      <p>Phone: {patient.phone}</p>
    </div>
  );
};

export default PatientCard;
