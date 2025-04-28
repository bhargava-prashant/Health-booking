import React, { useState } from 'react';

const BookingForm = ({ doctor, onSubmit, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ doctor_id: doctor.id, date, time });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Book Appointment with Dr. {doctor.first_name} {doctor.last_name}</h2>
        <label className="block mb-2">
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>
        <label className="block mb-4">
          Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </label>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-4 px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Confirm</button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
