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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios"; // Import axios for HTTP requests
const apiUrl = "https://server-production-dd7a.up.railway.app";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const Assignment = ({ subjectId, user }) => {
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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

  const handleTakeAssignment = (assignment) => {
    setCurrentAssignment(assignment);
  };

  const handleAnswerChange = (value) => {
    const updatedAssignments = assignments.map((assignment) => {
      if (assignment.id === currentAssignment.id) {
        return { ...assignment, answer: value };
      }
      return assignment;
    });
    setAssignments(updatedAssignments);
  };

  const handleSubmit = () => {
    if (currentAssignment.answer.trim() === "") {
      setSnackbarMessage("Please enter an answer before submitting.");
      setSnackbarOpen(true);
      return;
    }

    // Here, you would typically send the answer to the server
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === currentAssignment.id
        ? { ...assignment, score: 75 } // Replace with dynamic scoring as needed
        : assignment
    );
    setAssignments(updatedAssignments);
    setCurrentAssignment(null);
    setSnackbarMessage("Assignment submitted successfully!");
    setSnackbarOpen(true);
  };

  const handleViewScore = (assignment) => {
    alert(
      assignment.score !== null
        ? `Your score: ${assignment.score}`
        : "Not scored yet"
    );
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setDetailsOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedAssignment(null);
  };

  return (
    <div>
      <h2>Assignments for {subjectId}</h2>
      {user && <p>Student: {user.name}</p>}

      {!currentAssignment ? (
        <Grid container spacing={2}>
          {assignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment.id}>
              <Card
                variant="outlined"
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent>
                  <Typography variant="h6">{assignment.title}</Typography>
                  <div className="flex gap-2 mt-2">
                    {assignment.score === null ? (
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#207E68",
                          "&:hover": { bgcolor: "#1a5b4f" },
                        }}
                        onClick={() => handleTakeAssignment(assignment)}
                      >
                        Take Assignment
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => handleViewScore(assignment)}
                      >
                        View Score
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => handleViewDetails(assignment)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className="mt-4">
          <h4>{currentAssignment.title} Assignment Form</h4>
          <TextField
            label="Your Answer"
            variant="outlined"
            fullWidth
            multiline
            value={currentAssignment.answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="mt-2"
            sx={{
              bgcolor: "#207E68",
              mt: 2,
              borderColor: "#207E68",
              "&:hover": { bgcolor: "#1a5b4f" },
            }}
          >
            Submit Assignment
          </Button>
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails}>
        <DialogTitle>Assignment Details</DialogTitle>
        <DialogContent>
          {selectedAssignment && (
            <>
              <Typography variant="h6">{selectedAssignment.title}</Typography>
              <Typography variant="body1">
                {selectedAssignment.description}
              </Typography>
              <Typography variant="body2">
                Duration: {selectedAssignment.duration} mins
              </Typography>
              <Typography variant="body2">
                Total Marks: {selectedAssignment.totalMarks}
              </Typography>
              <Typography variant="body2">
                Pass Marks: {selectedAssignment.passMarks}
              </Typography>
              <Typography variant="body2">
                Deadline:{" "}
                {new Date(selectedAssignment.deadline).toLocaleString()}
              </Typography>
              <Typography variant="h6">Questions:</Typography>
              {selectedAssignment.questions.map((question, index) => (
                <div key={index}>
                  <Typography variant="body2">
                    {index + 1}. {question.questionText}
                  </Typography>
                  <ul>
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex}>{option.optionText}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Assignment;
