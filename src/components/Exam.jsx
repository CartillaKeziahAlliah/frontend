import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// Define your API URL
const apiUrl = "http://localhost:5000";

// Component for the Exam
const Exam = ({ subjectId, user, subject }) => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [takeExam, setTakeExam] = useState(false);
  const [viewScore, setViewScore] = useState(null); // New state for viewing score

  // Fetch exams when the component mounts
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/exam/bysubject/${subjectId}`
        );
        setExams(response.data);
        console.log("Exams fetched:", response.data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };

    fetchExams();
  }, [subjectId]);

  // Handle when a user starts taking an exam
  const handleTakeExam = (exam) => {
    setCurrentExam(exam);
    setTakeExam(true);
    setAnswers({}); // Reset answers
  };

  // Handle answer selection for each question
  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: value, // Store answer as the index of the selected option
    }));
  };

  // Submit answers for grading
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/exam/${currentExam._id}/take`,
        {
          studentId: user._id,
          answers: Object.values(answers), // Convert answers object to array for backend
        }
      );

      // Update the exam score in local state
      const updatedExams = exams.map((exam) =>
        exam._id === currentExam._id
          ? { ...exam, score: response.data.obtainedMarks }
          : exam
      );
      setExams(updatedExams);
      setCurrentExam(null);

      // Show result to the student
      alert(
        `Exam submitted! Your score: ${response.data.obtainedMarks}/${
          response.data.totalMarks
        }. Passed: ${response.data.passed ? "Yes" : "No"}`
      );
    } catch (error) {
      console.error("Failed to submit exam:", error);
    }
  };

  // View detailed exam information
  const handleViewScore = (exam) => {
    const studentScore = exam.scores.find(
      (score) => score.studentId.toString() === user._id.toString()
    );
    setViewScore(studentScore);
  };
  const handleCloseScore = () => {
    setViewScore(null);
  };
  return (
    <div>
      <h2>Exams for {subject.subject_name}</h2>
      {user && <p>Student: {user.name}</p>}

      {currentExam && takeExam ? (
        <div>
          <button onClick={() => setTakeExam(false)}>Back</button>
          <h4>{currentExam.title} Questions</h4>
          {currentExam.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p>{question.questionText}</p>
              <FormControl component="fieldset">
                <RadioGroup
                  onChange={(e) =>
                    handleAnswerChange(index, Number(e.target.value))
                  }
                >
                  {question.options.map((option, choiceIndex) => (
                    <FormControlLabel
                      key={choiceIndex}
                      value={choiceIndex} // Value is choiceIndex (index of the option)
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
              borderColor: "#207E68",
              "&:hover": { bgcolor: "#1a5b4f" },
            }}
            onClick={handleSubmit}
          >
            Submit Exam
          </Button>
        </div>
      ) : (
        <Grid container spacing={2}>
          {exams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam._id}>
              <Card
                variant="outlined"
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent>
                  <Typography variant="h6">{exam.title}</Typography>

                  <div className="flex gap-2 mt-2">
                    {exam.scores.some(
                      (score) =>
                        score.studentId.toString() === user._id.toString()
                    ) ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewScore(exam)}
                      >
                        View Score
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleTakeExam(exam)}
                        sx={{
                          mt: 2,
                          bgcolor: "#207E68",
                          borderColor: "#207E68",
                          "&:hover": { bgcolor: "#1a5b4f" },
                        }}
                      >
                        Take Exam
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {viewScore && (
        <Dialog open={Boolean(viewScore)} onClose={handleCloseScore}>
          <DialogTitle>Exam Score</DialogTitle>
          <DialogContent>
            <Typography>Score: {viewScore.obtainedMarks}</Typography>
            <Typography>Passed: {viewScore.passed ? "Yes" : "No"} </Typography>
            <Typography>
              Exam Date:{" "}
              {new Date(viewScore.examDate).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseScore} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Exam;
