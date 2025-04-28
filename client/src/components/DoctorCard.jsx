import React from 'react';

const DoctorCard = ({ doctor, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">{doctor.first_name} {doctor.last_name}</h3>
      <p>Specialization: {doctor.specialization}</p>
      <button
        onClick={() => onSelect(doctor)}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default DoctorCard;
