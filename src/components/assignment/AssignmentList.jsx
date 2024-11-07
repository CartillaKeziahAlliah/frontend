// AssignmentList.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Close,
  Delete,
  DescriptionOutlined,
  DragIndicator,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import AssScoresView from "./AssScoresView";
import AddIcon from "@mui/icons-material/Add";

// const apiUrl = "http://localhost:5000";
const apiUrl = "https://server-production-dd7a.up.railway.app";

const AssignmentList = ({ selectedSubject, setAction }) => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [viewlist, setViewlist] = useState(true);
  const [showScores, setShowScores] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);
  const handleViewScores = (assignmentId) => {
    console.log("Selected Quiz ID:", assignmentId);
    setSelectedAssignmentId(assignmentId);
    setShowScores(true);
    setSelectedAssignment(null);
    setViewlist(false);
  };

  const { user } = useAuth();

  const handleMenuOpen = (event, assignmentId) => {
    setAnchorEl(event.currentTarget);
    setActiveAssignmentId(assignmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveAssignmentId(null);
  };
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
    setAnchorEl(null);
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
    setSelectedAssignment(assignment);
    setViewlist(false);
  };

  const clearSelectedAssignment = () => {
    setSelectedAssignment(null); // Clear selected assignment
    setAnchorEl(null);
    setViewlist(true);
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
        <button
          onClick={setAction}
          className="flex justify-center items-center mb-4 rounded-full hover:bg-gray-300 px-2"
        >
          <AddIcon />
        </button>
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
            paginatedAssignments.map((assignment) => (
              <Paper
                key={assignment._id}
                elevation={3}
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className="capitalize"
                  gap={1}
                >
                  <DragIndicator />
                  <DescriptionOutlined
                    sx={{ color: "rgba(67, 141, 97, 0.8)" }}
                  />
                  <div className="flex justify-center">
                    <Typography variant="h6">{assignment.title}</Typography>
                  </div>
                </Box>

                <Box>
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, assignment._id)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={
                      Boolean(anchorEl) && activeAssignmentId === assignment._id
                    }
                    onClose={handleMenuClose}
                  >
                    {user.role !== "student" && (
                      <MenuItem
                        onClick={() => deleteAssignment(assignment._id)}
                        sx={{ color: "red" }}
                      >
                        <Delete />
                      </MenuItem>
                    )}
                    {user.role !== "student" && (
                      <MenuItem
                        onClick={() => handleAssignmentClick(assignment)}
                      >
                        View Assignment
                      </MenuItem>
                    )}
                    {user.role !== "student" && (
                      <MenuItem onClick={() => handleViewScores(assignment)}>
                        View Scores
                      </MenuItem>
                    )}
                    {user.role === "student" && <MenuItem>Take Quiz</MenuItem>}
                  </Menu>
                </Box>
              </Paper>
            ))
          ) : (
            <p>No assignments found.</p>
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
        </>
      )}

      {/* Selected Assignment Details */}
      {selectedAssignment && (
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="flex flex-row justify-between">
            <Typography variant="h6">Assignment Details</Typography>

            <Button onClick={clearSelectedAssignment}>
              <Close className="text-black" />
            </Button>
          </div>
          <div className="flex flex-row flex-wrap justify-between">
            <div className="flex flex-row items-center gap-1">
              <Typography variant="body1" fontWeight="bold">
                Title:
              </Typography>
              <Typography variant="body2" className="capitalize">
                {selectedAssignment.title}
              </Typography>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Typography variant="body1" fontWeight="bold">
                Description:
              </Typography>
              <Typography variant="body2" className="capitalize">
                {selectedAssignment.description}
              </Typography>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Typography variant="body1" fontWeight="bold">
                Duration:
              </Typography>
              <Typography variant="body2" className="capitalize">
                {selectedAssignment.duration} minutes
              </Typography>
            </div>
            <div className="flex flex-row items-center gap-1">
              {" "}
              <Typography variant="body1" fontWeight="bold">
                Total Marks:
              </Typography>
              <Typography variant="body2" className="capitalize">
                {selectedAssignment.totalMarks}
              </Typography>
            </div>
            <div className="flex flex-row items-center gap-1">
              {" "}
              <Typography variant="body1" fontWeight="bold">
                Pass Marks:
              </Typography>
              <Typography variant="body2" className="capitalize">
                {selectedAssignment.passMarks}
              </Typography>
            </div>
            <div className="flex flex-row items-center gap-1">
              {" "}
              <Typography variant="body1" fontWeight="bold">
                Deadline:
              </Typography>
              <Typography variant="body2" className="capitalize">
                {new Date(selectedAssignment.deadline).toLocaleDateString()}
              </Typography>
            </div>
          </div>
          <Typography variant="body1" fontWeight="bold" className="capitalize">
            Questions:
          </Typography>
          {selectedAssignment.questions.length > 0 ? (
            <ul>
              {selectedAssignment.questions.map((question, index) => (
                <li key={index}>
                  <Typography variant="body2" className="capitalize">
                    {index + 1}. {question.questionText}
                    <br />
                    Options:
                    <ul>
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex} className="capitalize">
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
