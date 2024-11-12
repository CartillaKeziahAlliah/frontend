import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  TableHead,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios"; // Import axios for HTTP requests
import { useAuth } from "../context/AuthContext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
const apiUrl = "http://localhost:5000";

// const apiUrl = "https://server-production-dd7a.up.railway.app";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const Assignment = ({ subjectId, user }) => {
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [takeAssignment, setTakeAssignment] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for the menu
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // Track remaining time
  const [timerActive, setTimerActive] = useState(false); // To control the timer state
  // Fetch assignments from the backend when the component mounts
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/assignment/bysubject/${subjectId}`
        );
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setSnackbarMessage("Failed to fetch assignments.");
        setSnackbarOpen(true);
      }
    };

    fetchAssignments();
  }, [subjectId]);

  const handleTakeAssignment = async (assignment) => {
    console.log(assignment._id);
    setCurrentAssignment(assignment);
    setTakeAssignment(true);
    setAnswers({});
    handleCloseMenu();
    setTimeLeft(assignment.duration * 60);
    setTimerActive(true);
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("user id", user); // Now this is safe because we already checked if currentAssignment exists

    try {
      const response = await axios.post(
        `${apiUrl}/api/assignment/${currentAssignment._id}/take`,
        {
          studentId: user,
          answers: Object.values(answers),
        }
      );

      const updatedAssignments = assignments.map((assignment) =>
        assignment._id === currentAssignment._id
          ? { ...assignment, score: response.data.obtainedMarks } // Replace with dynamic scoring as needed
          : assignment
      );

      setAssignments(updatedAssignments);
      setCurrentAssignment(null);
      setSnackbarMessage("Assignment submitted successfully!");
      setSnackbarOpen(true);
      window.location.reload(); // You may want to optimize this to avoid full page reload
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedAssignment(null);
  };
  const handleOpenMenu = (event, assignment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAssignment(null);
  };
  useEffect(() => {
    let timer;

    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Decrease time every second
    }

    if (timeLeft === 0) {
      // Time's up, auto-submit the exam
      handleSubmit();
    }

    return () => {
      clearInterval(timer); // Clean up the interval on unmount or when timer is inactive
    };
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };
  return (
    <div>
      {currentAssignment && takeAssignment ? (
        <div>
          <button onClick={() => setTakeAssignment(false)}>back</button>
          <h4>{currentAssignment.title} Questions</h4>
          <Typography variant="h6">
            Time Left: {formatTime(timeLeft)}
          </Typography>
          {currentAssignment.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p>
                {index + 1}. {question.questionText}
              </p>{" "}
              <FormControl component="fieldset">
                <RadioGroup
                  onChange={(e) =>
                    handleAnswerChange(index, Number(e.target.value))
                  }
                >
                  {question.options.map((option, choiceIndex) => (
                    <FormControlLabel
                      key={choiceIndex}
                      value={choiceIndex}
                      control={<Radio />}
                      label={option.optionText}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          ))}
          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#207E68",
              "&:hover": { bgcolor: "#1a5b4f" },
            }}
            onClick={handleSubmit}
          >
            Submit Assignment
          </Button>{" "}
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead bgColor="#cdcdcd">
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.duration}</TableCell>
                  <TableCell align="right">
                    {assignment.scores.some(
                      (score) => score.studentId === user
                    ) ? (
                      <Typography color="green">Completed </Typography>
                    ) : (
                      <>
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, assignment)}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(
                            anchorEl &&
                              selectedAssignment?._id === assignment._id
                          )}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem
                            onClick={() => handleTakeAssignment(assignment)}
                          >
                            Take assignment
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                  </TableCell>{" "}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Assignment;
