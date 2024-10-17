import React, { useState, useEffect } from "react";

const EditEvent = ({ event, updateEvent, cancelEditing }) => {
  const [updatedEvent, setUpdatedEvent] = useState(event);

  useEffect(() => {
    setUpdatedEvent(event);
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent({ ...updatedEvent, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEvent(updatedEvent._id, updatedEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
      <input
        type="text"
        name="event_title"
        value={updatedEvent.event_title}
        onChange={handleChange}
        placeholder="Event Title"
        required
        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
      />
      <input
        type="time"
        name="event_time"
        value={updatedEvent.event_time}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
      />
      <textarea
        name="note"
        value={updatedEvent.note}
        onChange={handleChange}
        placeholder="Note"
        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
      />
      <input
        type="text"
        name="student"
        value={updatedEvent.student}
        onChange={handleChange}
        placeholder="Student"
        required
        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
      >
        Update Event
      </button>
      <button
        type="button"
        onClick={cancelEditing}
        className="bg-gray-500 text-white rounded-md p-2 hover:bg-gray-600 transition duration-200 ml-2"
      >
        Cancel
      </button>
    </form>
  );
};

export default EditEvent;
