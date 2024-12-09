// EventCalendar.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Calendar from "./calendar/customCalendar"; // Import the new Calendar component
import { FaPlus } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Delete, Edit } from "@mui/icons-material";

const apiUrl = "https://server-production-dd7a.up.railway.app";
// const apiUrl = "http://localhost:5000";

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

  const handleDateClick = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    if (day >= today) {
      setSelectedDate(day);
    }
  };
  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(nextMonth);
  };

  const handlePreviousMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(prevMonth);
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

    // Extract hours and minutes from eventTime
    const [hours, minutes] = eventTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      showSnackbar("Invalid time format", "error");
      return;
    }

    // Create event_date and event_time
    const eventDate = new Date(selectedDate).toISOString().split("T")[0]; // Extract YYYY-MM-DD
    const formattedEventTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`; // Format HH:mm

    const eventData = {
      event_title: eventTitle,
      event_date: eventDate, // Send date separately
      event_time: formattedEventTime, // Send time separately
      note: note,
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

  return (
    <div className="calendar-container h-full bg-[#207E68] flex justify-center flex-col items-center flex-1 max-w-lg p-6 shadow-xl rounded-lg">
      <div className="w-full">
        {user.role !== "student" && (
          <Tooltip title="Add Event" arrow>
            <button
              onClick={handleOpenDialog}
              className="mt-2 bg-gray-100 rounded-md bg-opacity-55 p-2 hover:bg-teal-600 hover:bg-opacity-80"
            >
              <FaPlus color="#fff" />
            </button>
          </Tooltip>
        )}
      </div>
      <div className="flex justify-between w-full mb-4">
        <h1 className="text-3xl font-semibold text-black">
          {selectedDate.toLocaleString("default", { month: "long" })}{" "}
          {selectedDate.getFullYear()}
        </h1>
        <div>
          <Tooltip title="Previous Month" arrow>
            <button onClick={handlePreviousMonth} className="text-white">
              <ChevronLeft />
            </button>
          </Tooltip>

          <Tooltip title="Next Month" arrow>
            <button onClick={handleNextMonth} className="text-white">
              <ChevronRight />
            </button>
          </Tooltip>
        </div>
      </div>

      <Calendar
        selectedDate={selectedDate}
        events={events}
        disablePast={true}
        onDateClick={handleDateClick}
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {editingEventId
            ? `Edit Event ${selectedDate.toLocaleString()}`
            : "Add Event"}
        </DialogTitle>
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
            InputLabelProps={{
              shrink: true, // Keeps the label above the input
            }}
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
        <h3 className="text-lg font-semibold text-white">
          {selectedDate.toDateString()}
        </h3>

        <ul className="mt-2 bg-white rounded-lg shadow-md p-4">
          {events.length === 0 ? (
            <div className="text-center text-gray-400">
              No events for the selected date!
            </div>
          ) : (
            <>
              {events.map((event) => (
                <li
                  key={event._id}
                  className="flex justify-between items-center p-2 border-b border-gray-700"
                >
                  <div>
                    <strong className="text-black capitalize">
                      <p className="w-full break-all">{event.event_title}</p>
                    </strong>{" "}
                    -{" "}
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
                  </div>
                  {user.role !== "student" && (
                    <div className="flex ">
                      <Button
                        onClick={() => handleEditEvent(event)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(event._id)}
                        color="secondary"
                        size="small"
                      >
                        <Delete />
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
