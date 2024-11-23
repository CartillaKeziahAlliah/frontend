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
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Add as AddIcon } from "@mui/icons-material";

const Student = ({ handleBackToDashboard }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students data from the backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/students"
        ); // Update with the correct API endpoint
        setStudents(response.data); // Assuming the response is an array of students
        setFilteredStudents(response.data);
      } catch (err) {
        setError("Failed to fetch students");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search term
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setPage(0); // Reset to the first page when search term changes
  }, [searchTerm, students]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBlock = (studentId) => {
    console.log("Block student with id:", studentId);
    // Implement block functionality here
  };

  const handleDelete = (studentId) => {
    console.log("Delete student with id:", studentId);
    // Implement delete functionality here
  };

  const handleUpdate = (studentId) => {
    console.log("Update student with id:", studentId);
    // Implement update functionality here
  };

  return (
    <div className="w-full p-[2%]">
      <div className="flex justify-between gap-2 mb-4">
        <button
          type="button"
          className="p-2 mt-4 bg-[#207E68] border border-1 text-white rounded-full"
          onClick={handleBackToDashboard}
          aria-label="Back to Dashboard"
        >
          Back to Dashboard
        </button>
        <div className="mt-4 flex-1">
          <input
            type="text"
            placeholder="Search Sections..."
            className="p-2 border w-full border-gray-300 rounded-full focus:outline-[#207E68]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <button
          //   onClick={handleAddSectionDialogOpen}
          className="mt-4 p-1  border-4 border-[#207E68] text-[#207E68] rounded-full"
        >
          <AddIcon />
        </button>
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
            {filteredStudents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleUpdate(student._id)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleBlock(student._id)}
                      aria-label="block"
                    >
                      <BlockIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(student._id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
};

export default Student;
