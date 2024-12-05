import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Tooltip,
  Menu,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { Close, MoreHoriz } from "@mui/icons-material";
// const apiUrl = "http://localhost:5000"; // Your API URL
const apiUrl = "https://server-production-dd7a.up.railway.app";
const Student = ({ handleBackToDashboard }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSectionId, setNewSectionId] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Toggle between text and form
  const [anchorEl, setAnchorEl] = useState(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  // Fetch students and sections data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/students`);
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (err) {
        setError("Failed to fetch students");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/section/`);
        setSections(response.data);
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };

    fetchStudents();
    fetchSections();
  }, []);
  const handleBlockUser = async (userId) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/manage/block-user/${selectedStudent._id}`
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Blocked!",
          text: "Student blocked successfully!",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // Reload the page after confirmation
        });
      }
    } catch (error) {
      console.error("Error blocking student:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error blocking student.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUnBlockUser = async (userId) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/manage/unblock-user/${selectedStudent._id}`
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Unblocked!",
          text: "Student unblocked successfully!",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload(); // Reload the page after confirmation
        });
      }
    } catch (error) {
      console.error("Failed unblocking student:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed unblocking student.",
        confirmButtonText: "OK",
      });
    }
  };
  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setPage(0);
  }, [searchTerm, students]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleUpdate = (student) => {
    setNewSectionId(student.sections?.[0] || ""); // Pre-fill with current section if available
    setIsModalOpen(true);
  };

  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student); // Set the selected student here
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setNewSectionId("");
  };

  const handleSectionChange = (event) => {
    setNewSectionId(event.target.value);
  };

  const handleSave = async () => {
    try {
      // Show SweetAlert confirmation
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to assign this student to a new section.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, assign it!",
        cancelButtonText: "No, cancel",
      });

      // If the user confirms, proceed with the action
      if (result.isConfirmed) {
        if (!newSectionId) {
          alert("Please select a section.");
          return;
        }

        const response = await axios.post(`${apiUrl}/api/users/add-student`, {
          studentId: selectedStudent._id,
          sectionId: newSectionId,
        });

        // Update the local state with the new section data
        const updatedStudents = students.map((student) =>
          student._id === selectedStudent._id
            ? { ...student, sections: [newSectionId] }
            : student
        );

        setStudents(updatedStudents);
        setFilteredStudents(updatedStudents);
        handleModalClose();

        // Show success alert with SweetAlert
        Swal.fire("Success!", response.data.message, "success").then(() => {
          window.location.reload();
        });

        // Reload the page after successful update
      }
    } catch (error) {
      console.error("Error updating student section:", error);
      alert("Failed to update student section.");
    }
  };

  return (
    <div className="w-full p-[2%]">
      <div className="flex justify-between gap-2 mb-4">
        <button
          type="button"
          className="p-2 mt-4 bg-[#207E68] border border-1 text-white rounded-full"
          onClick={handleBackToDashboard}
        >
          Back to Manage
        </button>
        <div className="mt-4 flex-1">
          <input
            type="text"
            placeholder="Search Students..."
            className="p-2 border w-full border-gray-300 rounded-full focus:outline-[#207E68]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="student table">
          <TableHead sx={{ bgcolor: "#207E68" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "large" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell sx={{ textAlign: "center" }} colSpan={3}>
                  No Students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, student)}
                      >
                        <MoreHoriz />
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        {selectedStudent?.status === "blocked" ? (
                          <MenuItem
                            onClick={() => {
                              handleUnBlockUser(student._id);
                              handleMenuClose();
                            }}
                          >
                            Unblock
                          </MenuItem>
                        ) : (
                          <MenuItem
                            onClick={() => {
                              handleBlockUser(student._id);
                              handleMenuClose();
                            }}
                          >
                            Block
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            handleUpdate(student);
                            handleMenuClose();
                          }}
                        >
                          Update
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Update Modal */}
      <Dialog open={isModalOpen} fullWidth onClose={handleModalClose}>
        <div className="flex justify-between">
          <DialogTitle>Update Student Section</DialogTitle>
          <Button onClick={handleModalClose} color="secondary">
            <Close />
          </Button>
        </div>
        <DialogContent
          sx={{ display: "flex", gap: 2, flexDirection: "column" }}
        >
          <Typography variant="body1" gutterBottom>
            <strong>Name:</strong>
            <br />{" "}
            <span className="capitalize">{selectedStudent?.name || "N/A"}</span>
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> <br /> {selectedStudent?.email || "N/A"}
          </Typography>

          {!isEditing ? (
            <div className="flex flex-row justify-between">
              <Typography variant="body1" gutterBottom>
                <strong>Current Section:</strong> <br />
                {selectedStudent?.sections[0]?.section_name || "N/A"}
              </Typography>
              <Tooltip arrow title="Edit">
                <IconButton
                  size="small"
                  onClick={handleEditClick}
                  aria-label="Edit Section"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          ) : (
            <>
              <FormControl fullWidth margin="dense" variant="outlined">
                <InputLabel id="section-select-label">Section</InputLabel>
                <Select
                  labelId="section-select-label"
                  value={newSectionId || selectedStudent?.sections[0]?._id}
                  onChange={handleSectionChange}
                  label="Section"
                >
                  {selectedStudent?.sections?.length > 0 && (
                    <MenuItem disabled>
                      {selectedStudent?.sections[0]?.section_name} (Current)
                    </MenuItem>
                  )}

                  {sections
                    .filter(
                      (section) =>
                        !selectedStudent?.sections.some(
                          (studentSection) => studentSection._id === section._id
                        )
                    )
                    .map((section) => (
                      <MenuItem key={section._id} value={section._id}>
                        {section.section_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <div>
                <Button
                  size="small"
                  onClick={handleCancelEdit}
                  color="secondary"
                  style={{ marginTop: "8px" }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
          <Typography variant="body1" gutterBottom>
            <strong>LRN:</strong>
            <br /> {selectedStudent?.LRN || "N/A"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSave}
            color="primary"
            sx={{ bgcolor: "#207E68" }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Student;
