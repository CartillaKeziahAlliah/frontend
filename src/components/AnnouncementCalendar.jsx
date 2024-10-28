import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Calendar styles
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const apiUrl = "https://server-production-dd7a.up.railway.app";

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [note, setNote] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const { user } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);

  const fetchEvents = async (date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await axios.get(
        `${apiUrl}/api/calendar/events/${formattedDate}`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      showSnackbar("Error fetching events", "error");
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    resetForm();
  };

  const resetForm = () => {
    setEventTitle("");
    setEventTime("");
    setNote("");
    setEditingEventId(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmitEvent = async () => {
    if (!eventTitle || !eventTime) {
      showSnackbar("Please provide both event title and time", "error");
      return;
    }

    const eventData = {
      event_title: eventTitle,
      event_time: eventTime,
      note: note,
      event_date: selectedDate.toISOString().split("T")[0],
    };

    try {
      if (editingEventId) {
        await axios.put(
          `${apiUrl}/api/calendar/events/${editingEventId}`,
          eventData
        );
        showSnackbar("Event updated successfully!", "success");
      } else {
        await axios.post(`${apiUrl}/api/calendar/events`, eventData);
        showSnackbar("Event added successfully!", "success");
      }
      fetchEvents(selectedDate);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding/updating event:", error);
      showSnackbar("Error adding/updating event", "error");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/calendar/events/${id}`);
      showSnackbar("Event deleted successfully!", "success");
      fetchEvents(selectedDate);
    } catch (error) {
      console.error("Error deleting event:", error);
      showSnackbar("Error deleting event", "error");
    }
  };

  const handleEditEvent = (event) => {
    setEventTitle(event.event_title);
    setEventTime(event.event_time);
    setNote(event.note);
    setEditingEventId(event._id);
    setIsDialogOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getEventCountForDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return events.filter((event) => event.event_date === formattedDate).length;
  };

  const tileContent = ({ date }) => {
    const eventCount = getEventCountForDate(date);
    if (eventCount === 0) return null;

    const colors = ["#FF6347", "#FFD700", "#4CAF50"];
    const dots = Array.from({ length: Math.min(eventCount, 3) }, (_, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: colors[i],
          margin: "0 2px",
        }}
      ></span>
    ));

    return <div>{dots}</div>;
  };

  return (
    <div className="calendar-container h-full bg-[#207E68] flex justify-center flex-col items-center flex-1 max-w-lg p-6 shadow-lg rounded-lg">
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate}
        tileContent={tileContent}
        className="react-calendar"
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{editingEventId ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Event Title"
            fullWidth
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            margin="dense"
            required
          />
          <TextField
            label="Event Time"
            fullWidth
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            margin="dense"
            type="time"
            required
          />
          <TextField
            label="Note"
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitEvent} color="primary">
            {editingEventId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="mt-4 w-full">
        <h3 className="text-lg font-bold text-white">
          {selectedDate.toDateString()}
        </h3>
        {user.role !== "student" && (
          <Button
            onClick={handleOpenDialog}
            color="primary"
            variant="contained"
            className="mt-2"
          >
            Add Event
          </Button>
        )}
        <ul className="mt-2 bg-white rounded-lg shadow-md p-4">
          {events.length === 0 ? (
            <div className="text-center">No events for the selected date!</div>
          ) : (
            <>
              {events.map((event) => (
                <li
                  key={event._id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <div>
                    <strong>{event.event_title}</strong> -{" "}
                    {new Date(event.event_datetime).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}{" "}
                    at{" "}
                    {new Date(event.event_datetime).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                    <br />
                    <span className="text-gray-600">{event.note}</span>
                  </div>
                  {user.role !== "student" && (
                    <div className="flex flex-row">
                      <Button
                        onClick={() => handleEditEvent(event)}
                        color="primary"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(event._id)}
                        color="secondary"
                        size="small"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </>
          )}
        </ul>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EventCalendar;
