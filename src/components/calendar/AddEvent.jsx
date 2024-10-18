import React, { useState } from "react";

const AddEvent = ({ addEvent }) => {
  const [event, setEvent] = useState({
    event_title: "",
    event_time: "",
    note: "",
    student: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent(event);
    setEvent({ event_title: "", event_time: "", note: "", student: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Event</h2>
      <input
        type="text"
        name="event_title"
        value={event.event_title}
        onChange={handleChange}
        placeholder="Event Title"
        required
        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
      />
      <input
        type="time"
        name="event_time"
        value={event.event_time}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
      />
      <textarea
        name="note"
        value={event.note}
        onChange={handleChange}
        placeholder="Note"
        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
      />
      <input
        type="text"
        name="student"
        value={event.student}
        onChange={handleChange}
        placeholder="Student"
        required
        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
      >
        Add Event
      </button>
    </form>
  );
};

export default AddEvent;
