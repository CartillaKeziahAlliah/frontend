import React, { useEffect, useState } from "react";
import axios from "axios";
import EventList from "./EventList";
import AddEvent from "./AddEvent";
import EditEvent from "./EditEvent";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const apiUrl = "https://backend-production-55e3.up.railway.app";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, [selectedDate]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/calendar/events`);
      const filteredEvents = response.data.events.filter(
        (event) =>
          new Date(event.event_date).toDateString() ===
          selectedDate.toDateString()
      );
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const addEvent = async (newEvent) => {
    try {
      await axios.post(`${apiUrl}/api/calendar/events`, {
        ...newEvent,
        event_date: selectedDate,
      });
      fetchEvents();
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  const updateEvent = async (id, updatedEvent) => {
    try {
      await axios.put(`${apiUrl}/api/calendar/events/${id}`, updatedEvent);
      fetchEvents();
      setIsEditing(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error("Error updating event", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/calendar/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const startEditing = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentEvent(null);
  };

  return (
    <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Event Manager</h1>
      <div className="mb-5">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="mx-auto"
        />
      </div>
      <div className="mb-5">
        {isEditing ? (
          <EditEvent
            event={currentEvent}
            updateEvent={updateEvent}
            cancelEditing={cancelEditing}
          />
        ) : (
          <AddEvent addEvent={addEvent} />
        )}
      </div>
      <EventList
        events={events}
        deleteEvent={deleteEvent}
        startEditing={startEditing}
      />
    </div>
  );
};

export default EventManager;
