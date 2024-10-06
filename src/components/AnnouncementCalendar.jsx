import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Calendar styles
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const AnnouncementCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleAddAnnouncement = () => {
    console.log(
      `Announcement for ${selectedDate.toDateString()}: ${announcement}`
    );
    setAnnouncement("");
    setIsDialogOpen(false);
  };

  return (
    <div className="calendar-container max-w-lg mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate}
        className="react-calendar"
      />

      {/* Modal */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add Announcement</DialogTitle>
        <DialogContent className="flex flex-col space-y-4">
          <p className="text-gray-700">
            Announcement for {selectedDate.toDateString()}
          </p>
          <TextField
            label="Announcement"
            variant="outlined"
            multiline
            rows={4}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddAnnouncement} color="primary">
            Add Announcement
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AnnouncementCalendar;
