import {
  Add,
  DeleteForeverRounded,
  DeleteOutline,
  Mail,
  PlusOneOutlined,
  Sort,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";
import userProfile from "../../assets/user.webp";
import Sidebar from "../../components/sidebar";

const Dashboard = () => {
  const [value, setValue] = useState(new Date());

  const [page, setPage] = useState("calendar");
  const SetCurrentPage = (currenpage) => {
    setPage(currenpage);
  };
  const [newAnnouncement, setNewAnnouncement] = useState({
    profile: userProfile,
    personName: "",
    role: "",
    content: "",
  });
  const [Announcements, setAnnouncements] = useState([
    {
      profile: userProfile,
      personName: "John kenneth Rosales",
      role: "President",
      content: "this is the first announcement",
      isRead: false,
    },
    {
      profile: userProfile,
      personName: "Jerlon Abayon",
      role: "Secretary",
      content: "this is the second announcement",
      isRead: false,
    },
    {
      profile: userProfile,
      personName: "Loigen Lariosa",
      role: "Kahoy kahoy ra",
      content: "this is the third announcement",
      isRead: false,
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAnnouncemet = () => {
    if (
      newAnnouncement.personName &&
      newAnnouncement.role &&
      newAnnouncement.content
    ) {
      setAnnouncements((prev) => [
        ...prev,
        { ...newAnnouncement, isRead: false },
      ]);
      setNewAnnouncement({
        profile: userProfile,
        personName: "",
        role: "",
        content: "",
      });
      handleDialogClose();
    } else {
      handleDialogClose();
      Swal.fire({
        title: "Ooppss!",
        text: "Please input the neccesary details",
        icon: "warning",
      });
    }
  };
  const handleDeleteAll = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "If yes, you will not be able to recover these informations!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I am sure!",
      cancelButtonText: "Please cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setAnnouncements([]);
        Swal.fire("Deleted", "ALl announcements have been deleted", "success");
      }
    });
  };

  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "If yes, you will not be able to recover these informations!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I am sure!",
      cancelButtonText: "Please cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setAnnouncements((prev) =>
          prev.filter((_, announcementIndex) => announcementIndex !== index)
        );
        Swal.fire("Deleted", "Announcement has been deleted.", "success");
      }
    });
  };

  const markAsRead = (index) => {
    setAnnouncements((prev) => {
      const updatedAnnouncements = [...prev];
      updatedAnnouncements[index].isRead = true;
      return updatedAnnouncements;
    });
  };

  const markAllAsRead = () => {
    setAnnouncements((prev) =>
      prev.map((announcement) => ({ ...announcement, isRead: true }))
    );
  };
  const unreadCount = Announcements.filter(
    (announcement) => !announcement.isRead
  ).length;
  return (
    <div>
      <div className="content w-full">
        <div className="flex justify-end px-4 text-[green] py-2">
          <AccountCircleIcon fontSize="large" />
        </div>
        <div className="flex flex-row gap-1 p-2">
          <Button
            onClick={() => SetCurrentPage("calendar")}
            variant={page === "calendar" ? "contained" : "outlined"}
            sx={{
              bgcolor: page === "calendar" ? "green" : "transparent",
              borderColor: page === "calendar" ? "none" : "green",
            }}
          >
            Calendar
          </Button>
          <Button
            onClick={() => SetCurrentPage("Announcement")}
            variant={page === "Announcement" ? "contained" : "outlined"}
            sx={{
              bgcolor: page === "Announcement" ? "green" : "transparent",
              borderColor: page === "Announcement" ? "none" : "green",
            }}
          >
            Announcement
          </Button>
        </div>
        <div>
          {page === "Announcement" && (
            <div className="px-10 shadow-lg m-10 py-5">
              <header className="flex flex-row justify-between border-b border-b-black">
                <h1 className="font-bold">ANNOUNCEMENTS</h1>
                <div>
                  <Button variant="text" onClick={handleDialogOpen}>
                    <Add />
                  </Button>
                  <Button variant="text">
                    SORT <Sort />
                  </Button>
                </div>
              </header>
              <br />
              <div>
                {Announcements.length === 0 ? (
                  <>
                    <p className="text-center">No announcemets</p>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    {" "}
                    {Announcements.map((announcement, index) => (
                      <div
                        key={index}
                        className={`${
                          announcement.isRead
                            ? "bg-[beige] flex flex-row gap-2 justify-between w-full "
                            : "bg-[white] flex flex-row gap-2 justify-between w-full "
                        }`}
                      >
                        <div className="flex flex-row gap-2 w-full ">
                          <div className="w-[10%]">
                            <img
                              className="w-full"
                              src={announcement.profile}
                              alt=""
                            />
                          </div>
                          <div className="border-b  border-b-black flex flex-row justify-between w-full">
                            <div>
                              <h1 className="text-[green] font-bold capitalize ">
                                {announcement.personName}
                              </h1>
                              <b>{announcement.role}</b>
                              <p>{announcement.content}</p>
                            </div>
                            <div>
                              <Button onClick={() => handleDelete(index)}>
                                <DeleteForeverRounded />
                              </Button>
                              {!announcement.isRead && (
                                <Button
                                  variant="text"
                                  onClick={() => markAsRead(index)}
                                  sx={{
                                    padding: "10px",
                                    width: "20%",
                                  }}
                                >
                                  <Mail />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-2 p-2 justify-end">
                <Button
                  onClick={handleDeleteAll}
                  variant="contained"
                  sx={{ bgcolor: "green" }}
                >
                  Delete ALl
                </Button>
                <Button
                  variant="contained"
                  onClick={markAllAsRead}
                  sx={{ bgcolor: "green" }}
                >
                  Mark all as read
                </Button>
              </div>
            </div>
          )}
          {page === "calendar" && (
            <div>
              {" "}
              <Calendar onChange={setValue} value={value} />
              <p>Selected date: {value.toDateString()}</p>
            </div>
          )}
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleDialogClose}>
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
            value={newAnnouncement.name}
            onChange={handleInputChange}
          ></TextField>
          <TextField
            autoFocus
            margin="dense"
            name="role"
            label="Role"
            type="text"
            fullWidth
            variant="outlined"
            value={newAnnouncement.role}
            onChange={handleInputChange}
          ></TextField>
          <TextField
            autoFocus
            margin="dense"
            name="content"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            value={newAnnouncement.content}
            onChange={handleInputChange}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAnnouncemet}
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
