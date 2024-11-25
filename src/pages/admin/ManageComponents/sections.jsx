import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Menu,
} from "@mui/material";
import Swal from "sweetalert2";
import { Add as AddIcon, MoreHoriz } from "@mui/icons-material";
// const apiUrl = "http://localhost:5000"; // Your API URL
const apiUrl = "https://server-production-dd7a.up.railway.app";
const Sections = ({ handleBackToDashboard }) => {
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSection, setEditSection] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [freeTeachers, setFreeTeachers] = useState([]);
  const [openSectionAddDialog, setOpenSectionAddDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sectionName, setSectionName] = useState(""); // State for section name

  const [sectionData, setSectionData] = useState({
    section_name: "",
    grade_level: "1st year", // Default value
    adviser: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/users/users`) // Fetch teachers
      .then((response) => setTeachers(response.data))
      .catch((error) => console.error("Error fetching teachers:", error));

    axios
      .get(`${apiUrl}/api/section/`) // Fetch sections
      .then((response) => setSections(response.data))
      .catch((error) => console.error("Error fetching sections:", error));
  }, []);

  const handleEditDialogOpen = (section) => {
    setEditSection(section);
    setSelectedTeacher(section.adviser); // Set the selected teacher based on the current adviser
    setOpenEditDialog(true);
  };

  const handleAddTeacherDialogOpen = (sectionId) => {
    setEditSection({ _id: sectionId }); // Set the section ID first
    axios
      .get(`${apiUrl}/api/users/excludedusers/${sectionId}`) // Use sectionId here
      .then((response) => setFreeTeachers(response.data))
      .catch((error) => console.error("Error fetching teachers:", error));
    setOpenAddDialog(true);
  };
  const handleAddSectionDialogOpen = () => {
    setOpenSectionAddDialog(true);
  };
  const handleAddSection = async () => {
    try {
      const { section_name, grade_level, adviser } = sectionData;
      // Make API request to add section
      const response = await axios.post(`${apiUrl}/api/section`, {
        section_name,
        grade_level,
        adviser,
      });

      Swal.fire({
        icon: "success",
        title: "Section Added Successfully",
        text: response.data.message,
      }).then(() => {
        setOpenSectionAddDialog(false);
        window.location.reload();
        setSectionData({
          section_name: "",
          grade_level: "1st year",
          adviser: "",
        });
      });
    } catch (error) {
      console.error("Error adding section:", error);
      Swal.fire({
        icon: "error",
        title: "Error Adding Section",
        text: "There was an error adding the section. Please try again.",
      });
    }
  };
  const handleEditSection = async () => {
    try {
      const updatedSection = {
        section_name: sectionName, // Use sectionName state instead of editSection.section_name
        adviser: selectedTeacher, // Use the selected teacher for the adviser
      };

      await axios.put(
        `${apiUrl}/api/section/${editSection._id}`,
        updatedSection
      );
      setEditSection(null);
      setSectionName(""); // Clear sectionName state after the update

      // Update the sections list
      setSections(
        sections.map((section) =>
          section._id === editSection._id
            ? { ...section, ...updatedSection }
            : section
        )
      );

      // Close the dialog first
      setOpenEditDialog(false);

      // Show success swal
      Swal.fire({
        icon: "success",
        title: "Section Updated Successfully",
        text: "The section has been updated successfully.",
      }).then(() => {
        window.location.reload(); // Replace with the desired URL if needed
      });
    } catch (error) {
      console.error("Error editing section:", error);

      // Show error swal
      Swal.fire({
        icon: "error",
        title: "Error Updating Section",
        text: "There was an error updating the section. Please try again.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSectionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Handle Add Teacher
  const handleAddTeacher = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/section/${editSection._id}/teacher/${selectedTeacher}`
      );
      setSections(
        sections.map((section) =>
          section._id === editSection._id
            ? { ...section, teacher: [...section.teacher, selectedTeacher] }
            : section
        )
      );
      setOpenAddDialog(false);

      // Show success swal
      Swal.fire({
        icon: "success",
        title: "Teacher Added Successfully",
        text: "The teacher has been added to the section.",
      }).then(() => {
        // Redirect to a new location after the success
        window.location.reload(); // Replace with the desired URL
      });
    } catch (error) {
      console.error("Error adding teacher:", error);

      // Show error swal
      Swal.fire({
        icon: "error",
        title: "Error Adding Teacher",
        text: "There was an error adding the teacher. Please try again.",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter sections based on the search query
  const filteredSections = sections.filter((section) =>
    section.section_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleDeleteSection = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this section. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#207E68",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiUrl}/api/section/${id}`)
          .then(() => {
            setSections(sections.filter((section) => section._id !== id));
            Swal.fire("Deleted!", "The section has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting section:", error);
            Swal.fire(
              "Error!",
              "There was an error deleting the section.",
              "error"
            );
          });
      } else {
        // If cancelled, no action is taken
        console.log("Section deletion cancelled.");
      }
    });
  };
  return (
    <div className="w-full p-[2%]">
      <div className="flex justify-between gap-2 mb-4">
        <button
          className="p-2 mt-4 bg-[#207E68] border border-1 text-[white] rounded-full"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
        <div className="mt-4 flex-1">
          <input
            type="text"
            placeholder="Search Sections..."
            className="p-2 border w-full border-gray-300 rounded-full focus:outline-[#207E68]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddSectionDialogOpen}
          className="mt-4 p-1  border-4 border-[#207E68] text-[#207E68] rounded-full"
        >
          <AddIcon />
        </button>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#207E68" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontSize: "large" }}>
                  Section Name
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: "large" }}>
                  Adviser
                </TableCell>
                <TableCell sx={{ color: "white", fontSize: "large" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSections.length !== 0 ? (
                filteredSections
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((section) => (
                    <TableRow key={section._id}>
                      <TableCell>{section.section_name}</TableCell>
                      <TableCell>{section.adviser.name}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={handleMenuOpen}
                          aria-controls={open ? "actions-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                        >
                          <MoreHoriz />
                        </IconButton>
                        <Menu
                          id="actions-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              handleEditDialogOpen(section);
                              handleMenuClose();
                            }}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleAddTeacherDialogOpen(section._id);
                              handleMenuClose();
                            }}
                          >
                            Add Teacher
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleDeleteSection(section._id);
                              handleMenuClose();
                            }}
                          >
                            Delete Section
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={3}>
                    No sections found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSections.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      {/* Edit Section Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Section </DialogTitle>
        <DialogContent>
          <TextField
            label="Section Name"
            value={sectionName} // Use state for dynamic value
            onChange={(e) => setSectionName(e.target.value)} // Update state on change
            fullWidth
            required // Make the input required
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="adviser-select-label" shrink>
              Adviser
            </InputLabel>
            <Select
              labelId="adviser-select-label"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              label="Adviser" // Ensure the label prop is also provided
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setOpenEditDialog(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleEditSection(sectionName)} // Pass sectionName to the handler
            color="primary"
            disabled={!sectionName} // Disable Save button if sectionName is empty
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAddDialog}
        maxWidth="md"
        onClose={() => setOpenAddDialog(false)}
        fullWidth
      >
        <DialogTitle>Add Teacher</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="teacher-select-label">Select Teacher</InputLabel>
            <Select
              name="teacher"
              labelId="teacher-select-label"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              label="Select Teacher"
              fullWidth
            >
              <MenuItem value="">
                <em>None</em>{" "}
              </MenuItem>
              {freeTeachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddDialog(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTeacher}
            color="primary"
            variant="contained"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSectionAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Section</DialogTitle>
        <DialogContent>
          <TextField
            label="Section Name"
            name="section_name"
            value={sectionData.section_name}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined" // Added variant
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            {" "}
            {/* Ensure variant and spacing */}
            <InputLabel>Grade Level</InputLabel>
            <Select
              name="grade_level"
              value={sectionData.grade_level}
              onChange={handleInputChange}
              label="Grade Level" // Add label prop for correct positioning
              fullWidth
            >
              {["1st year", "2nd year", "3rd year", "4th year"].map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            {" "}
            {/* Ensure variant and spacing */}
            <InputLabel>Adviser</InputLabel>
            <Select
              name="adviser"
              value={sectionData.adviser}
              onChange={handleInputChange}
              label="Adviser" // Add label prop for correct positioning
              required
              fullWidth
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setOpenSectionAddDialog(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddSection}
            color="primary"
          >
            Add Section
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sections;
