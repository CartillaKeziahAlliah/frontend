import React from "react";

const EventList = ({ events, deleteEvent, startEditing }) => {
  return (
    <div className="w-full max-w-2xl mt-5">
      <h2 className="text-2xl font-semibold mb-4">Events</h2>
      <ul className="list-none">
        {events.length === 0 ? (
          <li>No events found for this date.</li>
        ) : (
          events.map((event) => (
            <li
              key={event._id}
              className="flex justify-between items-center bg-white p-4 mb-2 rounded-lg shadow"
            >
              <div>
                <h3 className="font-bold">{event.event_title}</h3>
                <p>{event.event_time}</p>
                <p>{event.note}</p>
                <p>{event.student}</p>
              </div>
              <div>
                <button
                  onClick={() => startEditing(event)}
                  className="bg-yellow-500 text-white rounded-md p-2 mr-2 hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default EventList;
