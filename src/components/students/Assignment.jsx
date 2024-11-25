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
import { useAuth } from "../../context/AuthContext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Close } from "@mui/icons-material";
// const apiUrl = "http://localhost:5000";

const apiUrl = "https://server-production-dd7a.up.railway.app";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const Assignment = ({ subjectId, userId }) => {
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [takeAssignment, setTakeAssignment] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for the menu
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // Track remaining time
  const [timerActive, setTimerActive] = useState(false);
  const [assResult, setAssResult] = useState(null); // Store quiz result
  const [resultDialogOpen, setResultDialogOpen] = useState(false); // Dialog for result display
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/assignment/bysubject/${subjectId}`
        );
        const sortedAssignments = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAssignments(sortedAssignments);
        console.log(sortedAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setSnackbarMessage("Failed to fetch assignments.");
        setSnackbarOpen(true);
      }
    };

    fetchAssignments();
  }, [subjectId]);

  const handleTakeAssignment = async (assignment) => {
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
    try {
      const response = await axios.post(
        `${apiUrl}/api/assignment/${currentAssignment._id}/take`,
        {
          studentId: userId,
          answers: Object.values(answers),
        }
      );

      const updatedAssignments = assignments.map((assignment) =>
        assignment._id === currentAssignment._id
          ? { ...assignment, score: response.data.obtainedMarks }
          : assignment
      );

      setAssignments(updatedAssignments);
      setCurrentAssignment(null);
      setSnackbarOpen(true);
      setAssResult(response.data);
      setResultDialogOpen(true); // Open dialog to display the result
      setTakeAssignment(false);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      setSnackbarOpen(true);
    }
  };

  const handleOpenMenu = (event, assignment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedAssignment(null);
  };

  const handleResultDialogClose = () => {
    setResultDialogOpen(false);
    setAssResult(null);
  };

  useEffect(() => {
    let timer;

    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      handleSubmit();
    }

    return () => {
      clearInterval(timer);
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
          <button onClick={() => setTakeAssignment(false)}>Back</button>
          <h4>{currentAssignment.title} Questions</h4>
          <Typography variant="h6">
            Time Left: {formatTime(timeLeft)}
          </Typography>
          {currentAssignment.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p>
                {index + 1}. {question.questionText}
              </p>
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
          </Button>
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
                      (score) => score.studentId === userId
                    ) ? (
                      <Typography color="green">Completed</Typography>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Result Dialog */}
      <Dialog
        open={resultDialogOpen}
        onClose={handleResultDialogClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { width: "50%" },
          textAlign: "center",
        }}
      >
        <DialogActions>
          <Button onClick={handleResultDialogClose} color="primary">
            <Close />
          </Button>
        </DialogActions>
        <DialogTitle variant="h4" className="text-center text-green-700">
          Successfuly Submitted
        </DialogTitle>{" "}
        <DialogContent>
          <Typography sx={{ fontWeight: "bold" }} className="text-center">
            Your Score:
          </Typography>
          <Typography variant="h2">
            {assResult?.obtainedMarks} / {assResult?.totalMarks}
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: assResult?.passed ? "green" : "red" }}
          >
            {assResult?.passed ? "PASSED" : "FAILED"}
          </Typography>{" "}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assignment;
