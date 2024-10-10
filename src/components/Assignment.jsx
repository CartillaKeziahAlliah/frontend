import React, { useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

const Assignment = ({ courseName, user }) => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "First Assignment",
      score: null,
      answer: "",
    },
    {
      id: 2,
      title: "Second Assignment",
      score: null,
      answer: "",
    },
  ]);
  const [currentAssignment, setCurrentAssignment] = useState(null);

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
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === currentAssignment.id
        ? { ...assignment, score: 75 } // Example score
        : assignment
    );
    setAssignments(updatedAssignments);
    setCurrentAssignment(null); // Reset to show the list again
  };

  const handleViewScore = (assignment) => {
    alert(
      assignment.score !== null
        ? `Your score: ${assignment.score}`
        : "Not scored yet"
    );
  };

  return (
    <div>
      <h2>Assignments for {courseName}</h2>
      {user && <p>Student: {user.name}</p>}

      {/* Conditionally render the assignments or the current assignment form */}
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
                    {assignment.score !== null && (
                      <Button
                        variant="outlined"
                        onClick={() => handleViewScore(assignment)}
                      >
                        View Score
                      </Button>
                    )}
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
              "&:hover": {
                backgroundColor: "#f0f0f0",
                borderColor: "#1a5b4f",
              },
            }}
          >
            Submit Assignment
          </Button>
        </div>
      )}
    </div>
  );
};

export default Assignment;
