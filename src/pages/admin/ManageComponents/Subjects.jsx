import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";

const SubjectsTable = ({ handleBackToDashboard }) => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    subject_name: "",
    teacherId: "",
    sectionId: "",
  });

  // Fetch subjects, teachers, and sections from the server
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/manage/")
      .then((response) => setSubjects(response.data))
      .catch((error) => console.error("Error fetching subjects:", error));

    axios
      .get("http://localhost:5000/api/users/users") // Fetch teachers
      .then((response) => setTeachers(response.data))
      .catch((error) => console.error("Error fetching teachers:", error));

    axios
      .get("http://localhost:5000/api/section/") // Fetch sections
      .then((response) => setSections(response.data))
      .catch((error) => console.error("Error fetching sections:", error));
  }, []);

  // Handle dialog open
  const handleEditDialogOpen = (subject) => {
    setEditSubject(subject);
    setOpenEditDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenEditDialog(false);
    setOpenAddDialog(false);
    setEditSubject(null);
    setNewSubject({ subject_name: "", teacherId: "", sectionId: "" });
  };

  // Handle subject update
  const handleUpdateSubject = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to update this subject. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#207E68",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the update if the user confirms
        axios
          .put(
            `http://localhost:5000/api/manage/subjects/${editSubject._id}`,
            editSubject
          )
          .then(() => {
            // Update the subjects list in state with a new array reference
            setSubjects((prevSubjects) =>
              prevSubjects.map((subject) =>
                subject._id === editSubject._id
                  ? { ...subject, ...editSubject }
                  : subject
              )
            );
            handleDialogClose(); // Close the dialog
            Swal.fire("Updated!", "The subject has been updated.", "success");
          })
          .catch((error) => {
            console.error("Error updating subject:", error);
            Swal.fire(
              "Error!",
              "There was an error updating the subject.",
              "error"
            );
          });
      } else {
        // If cancelled, no action is taken
        console.log("Subject update cancelled.");
      }
    });
  };

  // Handle subject delete
  const handleDeleteSubject = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this subject. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#207E68",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the deletion if the user confirms
        axios
          .delete(`http://localhost:5000/api/manage/subjects/${id}`)
          .then(() => {
            setSubjects(subjects.filter((subject) => subject._id !== id));
            Swal.fire("Deleted!", "The subject has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting subject:", error);
            Swal.fire(
              "Error!",
              "There was an error deleting the subject.",
              "error"
            );
          });
      } else {
        // If cancelled, no action is taken
        console.log("Subject deletion cancelled.");
      }
    });
  };

  // Handle adding a new subject
  const handleAddSubject = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to add a new subject.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#207E68",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with adding the subject if confirmed
        axios
          .post("http://localhost:5000/api/manage/add", newSubject)
          .then((response) => {
            setSubjects((prevSubjects) => [
              ...prevSubjects,
              response.data.subject,
            ]);
            handleDialogClose(); // Close the dialog
            window.location.reload();
          })
          .catch((error) => console.error("Error adding subject:", error));
      } else {
        // If cancelled, no action is taken
        console.log("Subject addition cancelled.");
      }
    });
  };

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter((subject) =>
    subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="w-full p-[2%]">
      <div className="flex justify-between gap-2 mb-4">
        <button
          className=" p-2 mt-4 bg-[#207E68] border border-1 text-[white] rounded-full"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
        <div className="mt-4 flex-1">
          <input
            type="text"
            placeholder="Search instructors..."
            className="p-2 border w-full border-gray-300 rounded-full focus:outline-[#207E68]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={() => setOpenAddDialog(true)}
          className="mt-4 p-1  border-4 border-[#207E68] text-[#207E68] rounded-full"
        >
          <AddIcon />
        </button>
      </div>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: "#207E68" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Subject Name
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Teacher
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Section
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubjects
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>{subject.subject_name}</TableCell>
                  <TableCell>{subject.teacher.name}</TableCell>
                  <TableCell>{subject.section.section_name}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditDialogOpen(subject)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteSubject(subject._id)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredSubjects.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Subject Dialog */}
      <Dialog open={openEditDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Name"
            fullWidth
            value={editSubject?.subject_name || ""}
            onChange={(e) =>
              setEditSubject({ ...editSubject, subject_name: e.target.value })
            }
            margin="normal"
          />

          {/* Teacher Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Teacher</InputLabel>
            <Select
              value={editSubject?.teacher?._id || ""}
              onChange={(e) =>
                setEditSubject({
                  ...editSubject,
                  teacher: { _id: e.target.value },
                })
              }
              label="Teacher"
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Section Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Section</InputLabel>
            <Select
              value={editSubject?.section?._id || ""}
              onChange={(e) =>
                setEditSubject({
                  ...editSubject,
                  section: { _id: e.target.value },
                })
              }
              label="Section"
            >
              {sections.map((section) => (
                <MenuItem key={section._id} value={section._id}>
                  {section.section_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            variant="contained"
            onClick={handleUpdateSubject}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={openAddDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Subject</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Name"
            fullWidth
            value={newSubject.subject_name}
            onChange={(e) =>
              setNewSubject({
                ...newSubject,
                subject_name: e.target.value,
              })
            }
            margin="normal"
          />

          {/* Teacher Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Teacher</InputLabel>
            <Select
              value={newSubject.teacherId}
              onChange={(e) =>
                setNewSubject({
                  ...newSubject,
                  teacherId: e.target.value,
                })
              }
              label="Teacher"
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Section Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Section</InputLabel>
            <Select
              value={newSubject.sectionId}
              onChange={(e) =>
                setNewSubject({
                  ...newSubject,
                  sectionId: e.target.value,
                })
              }
              label="Section"
            >
              {sections.map((section) => (
                <MenuItem key={section._id} value={section._id}>
                  {section.section_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubject} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubjectsTable;
