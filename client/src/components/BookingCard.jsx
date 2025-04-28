import React from 'react';

const BookingCard = ({ doctor, onBookAppointment }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Book Appointment with Dr. {doctor.first_name} {doctor.last_name}</h2>
        <form onSubmit={onBookAppointment}>
          <label className="block mb-2">
            Date:
            <input type="date" className="w-full border p-2 rounded mt-1" required />
          </label>
          <label className="block mb-4">
            Time:
            <input type="time" className="w-full border p-2 rounded mt-1" required />
          </label>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingCard;
