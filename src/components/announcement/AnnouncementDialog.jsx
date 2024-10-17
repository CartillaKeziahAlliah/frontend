// src/components/AnnouncementDialog.js

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const AnnouncementDialog = ({
  open,
  onClose,
  newAnnouncement,
  onInputChange,
  onAddAnnouncement,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Announcements</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="personName"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newAnnouncement.personName}
          onChange={onInputChange}
        />
        <TextField
          margin="dense"
          name="role"
          label="Role"
          type="text"
          fullWidth
          variant="outlined"
          value={newAnnouncement.role}
          onChange={onInputChange}
        />
        <TextField
          margin="dense"
          name="content"
          label="Content"
          type="text"
          fullWidth
          variant="outlined"
          value={newAnnouncement.content}
          onChange={onInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onAddAnnouncement}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnouncementDialog;
