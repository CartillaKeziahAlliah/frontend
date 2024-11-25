import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Paper,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Swal from "sweetalert2";
// const apiUrl = "http://localhost:5000"; // Your API URL
const apiUrl = "https://server-production-dd7a.up.railway.app";

const fetchTeachers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/manage/teachers`);
    return response.data.data; // Assuming the API response has a 'data' field with the teacher list
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
};

const Instructors = ({ handleBackToDashboard }) => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // MUI pagination starts at 0
  const [itemsPerPage, setItemsPerPage] = useState(5); // New state for search query
  const [newInstructor, setNewInstructor] = useState({
    email: "",
    password: "",
    name: "", // Password field for the new instructor
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const { user } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const getTeachers = async () => {
      const teacherData = await fetchTeachers();
      setTeachers(teacherData);
    };

    getTeachers();
  }, []);

  // Filter teachers based on the search query
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset to first page when items per page change
  };
  // Action for blocking a user
  const handleBlockUser = async (userId) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/manage/block-user/${userId}`
      );
      if (response.status === 200) {
        setTeachers(
          teachers.map((teacher) =>
            teacher._id === userId ? { ...teacher, status: "blocked" } : teacher
          )
        );
        alert("User blocked successfully!");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Error blocking user.");
    }
  };
  const handleUnBlockUser = async (userId) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/manage/unblock-user/${userId}`
      );
      if (response.status === 200) {
        setTeachers(
          teachers.map((teacher) =>
            teacher._id === userId ? { ...teacher, status: "blocked" } : teacher
          )
        );
        alert("User unblocked successfully!");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Error unblocking user.");
    }
  };

  // Handle adding a new instructor

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    setError("");

    if (!newInstructor.email.trim() || !newInstructor.password.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all required fields.",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/manage/addInstructor`,
        newInstructor
      );

      if (response.status === 201) {
        setTeachers([...teachers, response.data.data]);
        setNewInstructor({ email: "", password: "", name: "" }); // Reset the form fields
        setIsModalOpen(false); // Close the modal
        Swal.fire({
          icon: "success",
          title: "Instructor Added",
          text: "Instructor added successfully!",
        });
      }
    } catch (error) {
      setError(error.response.data.error || "Failed to add instructor.");
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when the "Close" button is clicked
  };

  return (
    <div className="w-full p-[2%]">
      <div className="flex justify-between gap-2 mb-4">
        <button
          className="mt-4 p-2 bg-[#207E68] border border-1 text-[white] rounded-full"
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
          onClick={() => setIsModalOpen(true)}
          className="mt-4 p-1  border-4 border-[#207E68] text-[#207E68] rounded-full"
        >
          <Add />
        </button>
      </div>

      <TableContainer component={Paper} className="mt-4">
        <Table>
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
            {filteredTeachers
              .slice(
                currentPage * itemsPerPage,
                currentPage * itemsPerPage + itemsPerPage
              )
              .map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>

                  <TableCell>
                    {teacher.status === "blocked" ? (
                      <button
                        className="text-green-500"
                        onClick={() => handleUnBlockUser(teacher._id)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="text-red-500"
                        onClick={() => handleBlockUser(teacher._id)}
                      >
                        Block
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTeachers.length}
        rowsPerPage={itemsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for adding instructor */}
      <Dialog
        maxWidth="lg" // Increase the dialog width
        open={isModalOpen}
        sx={{
          "& .MuiDialog-paper": {
            width: "50%", // Custom width
            maxWidth: "none", // Remove maxWidth constraint
          },
        }}
      >
        <DialogTitle>Add New Teacher</DialogTitle>
        {error && (
          <Alert
            severity="error"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {error}
          </Alert>
        )}
        <DialogContent
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: "column",
            padding: "24px", // Increase padding for better spacing
          }}
        >
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            value={newInstructor.name}
            onChange={(e) =>
              setNewInstructor({ ...newInstructor, name: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={newInstructor.email}
            onChange={(e) =>
              setNewInstructor({ ...newInstructor, email: e.target.value })
            }
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password" // To hide the password input
            value={newInstructor.password}
            onChange={(e) =>
              setNewInstructor({ ...newInstructor, password: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          {" "}
          {/* Add padding for actions */}
          <Button onClick={handleCloseModal} color="secondary">
            Close
          </Button>
          <Button onClick={handleAddInstructor} color="primary">
            Add Instructor
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Instructors;
