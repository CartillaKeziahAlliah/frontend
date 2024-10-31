// AssignmentList.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
} from "@mui/material";
import { Delete, SearchOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AssScoresView from "./AssScoresView";

// const apiUrl = "http://localhost:5000";
const apiUrl = "https://server-production-dd7a.up.railway.app";

const AssignmentList = ({ selectedSubject }) => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [viewlist, setViewlist] = useState(true);
  const [showScores, setShowScores] = useState(false);

  const handleViewScores = (assignmentId) => {
    console.log("Selected Quiz ID:", assignmentId);
    setSelectedAssignmentId(assignmentId);
    setShowScores(true);
    setSelectedAssignment(null);
    setViewlist(false);
  };
  const { user } = useAuth();
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/assignment/bysubject/${selectedSubject._id}`
        );
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    if (selectedSubject) {
      fetchAssignments();
    }
  }, [selectedSubject]);
  const handleShowScoreClose = () => {
    setShowScores(false);
    setSelectedAssignmentId(null); // Set assignment ID to null
    setViewlist(true); // Toggle view list back to true
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    let sortedAssignments = [...assignments];

    if (option === "alphabetical") {
      sortedAssignments.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === "date") {
      sortedAssignments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setAssignments(sortedAssignments);
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm) ||
      assignment.description.toLowerCase().includes(searchTerm)
  );

  // Logic for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Get the assignments to display based on pagination
  const paginatedAssignments = filteredAssignments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const deleteAssignment = async (assignmentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/api/assignment/${assignmentId}`);
        setAssignments((prevAssignments) =>
          prevAssignments.filter(
            (assignment) => assignment._id !== assignmentId
          )
        );
        Swal.fire(
          "Deleted Successfully!",
          "This won't be retrieved again!",
          "success"
        );
      } catch (error) {
        console.error("Failed to delete assignment:", error);
      }
    }
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment); // Set the selected assignment for viewing
  };

  const clearSelectedAssignment = () => {
    setSelectedAssignment(null); // Clear selected assignment
  };

  return (
    <div className="assignment-list">
      <Box display="flex" flexDirection="row" gap={1} sx={{ marginTop: 2 }}>
        <div className="border border-gray-500 px-2 rounded-3xl mb-4 w-full flex flex-row items-center">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full p-2 outline-none rounded-3xl"
          />
        </div>

        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border border-gray-500 p-2 rounded-3xl mb-4"
        >
          <option value="">Sort by</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="date">Date</option>
        </select>
      </Box>

      {viewlist === true && (
        <>
          {paginatedAssignments.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Title
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Description
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Duration (min)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total Marks
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Pass Marks
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Deadline
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssignments.map((assignment) => (
                    <TableRow key={assignment._id} hover>
                      <TableCell>
                        <Typography variant="body1">
                          {assignment.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {assignment.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {assignment.duration}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {assignment.totalMarks}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {assignment.passMarks}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {new Date(assignment.deadline).toLocaleDateString()}{" "}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {user.role !== "student" && (
                          <Button
                            onClick={() => deleteAssignment(assignment._id)}
                            variant="text"
                            sx={{ color: "red" }}
                          >
                            <Delete />
                          </Button>
                        )}
                        {user.role !== "student" && (
                          <Button
                            onClick={() => handleAssignmentClick(assignment)}
                            variant="outlined"
                            sx={{
                              bgcolor: "#207E68",
                              borderRadius: "100px",
                              color: "white",
                            }}
                          >
                            View
                          </Button>
                        )}
                        {user.role !== "student" && (
                          <Button onClick={() => handleViewScores(assignment)}>
                            View Scores
                          </Button>
                        )}
                        {user.role === "student" && <Button>Take Quiz</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No assignments found.</p>
          )}
        </>
      )}

      {/* Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAssignments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Selected Assignment Details */}
      {selectedAssignment && (
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">Assignment Details</Typography>
          <Typography variant="body1" fontWeight="bold">
            Title:
          </Typography>
          <Typography variant="body2">{selectedAssignment.title}</Typography>
          <Typography variant="body1" fontWeight="bold">
            Description:
          </Typography>
          <Typography variant="body2">
            {selectedAssignment.description}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Duration:
          </Typography>
          <Typography variant="body2">
            {selectedAssignment.duration} minutes
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Total Marks:
          </Typography>
          <Typography variant="body2">
            {selectedAssignment.totalMarks}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Pass Marks:
          </Typography>
          <Typography variant="body2">
            {selectedAssignment.passMarks}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Deadline:
          </Typography>
          <Typography variant="body2">
            {new Date(selectedAssignment.deadline).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Questions:
          </Typography>
          {selectedAssignment.questions.length > 0 ? (
            <ul>
              {selectedAssignment.questions.map((question, index) => (
                <li key={index}>
                  <Typography variant="body2">
                    {index + 1}. {question.questionText}
                    <br />
                    Options:
                    <ul>
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex}>
                          {option.optionText}{" "}
                          {option.isCorrect ? "(Correct)" : ""}
                        </li>
                      ))}
                    </ul>
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">No questions available.</Typography>
          )}
          <Button
            onClick={clearSelectedAssignment}
            variant="outlined"
            sx={{ marginTop: 2 }}
          >
            Close
          </Button>
        </Box>
      )}
      {showScores && (
        <AssScoresView
          assignments={selectedAssignmentId}
          onClose={handleShowScoreClose}
        />
      )}
    </div>
  );
};

export default AssignmentList;
