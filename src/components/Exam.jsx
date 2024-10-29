import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
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
  duration,
} from "@mui/material";

// const apiUrl = "http://localhost:5000"; // Your API URL
const apiUrl = "https://server-production-dd7a.up.railway.app";

const Exam = ({ subjectId, user }) => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch exams when the component mounts
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/exam/bysubject/${subjectId}`
        );
        setExams(response.data);
        console.log("Exams fetched:", response.data); // Log the fetched exams
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };

    fetchExams();
  }, [subjectId]);

  const handleTakeExam = (exam) => {
    setCurrentExam(exam);
  };

  const handleAnswerChange = (index, value) => {
    const updatedExams = exams.map((exam) => {
      if (exam._id === currentExam._id) {
        const updatedQuestions = [...exam.questions];
        updatedQuestions[index].answer = value;
        return { ...exam, questions: updatedQuestions };
      }
      return exam;
    });
    setExams(updatedExams);
  };

  const handleSubmit = () => {
    // Simulate score calculation; here you could implement your own logic
    const updatedExams = exams.map((exam) =>
      exam._id === currentExam._id ? { ...exam, score: 90 } : exam
    );
    setExams(updatedExams);
    setCurrentExam(null);
  };

  const handleViewDetails = (exam) => {
    setCurrentExam(exam);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <div>
      <h2>Exams for {subjectId}</h2>
      {user && <p>Student: {user.name}</p>}

      {currentExam ? (
        <div>
          <h4>{currentExam.title} Questions</h4>
          {currentExam.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p>{question.questionText}</p>
              {question.type === "text" && (
                <TextField
                  label="Your Answer"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              )}
              {question.type === "multiple" && (
                <FormControl component="fieldset">
                  <RadioGroup
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  >
                    {question.options.map((option, choiceIndex) => (
                      <FormControlLabel
                        key={choiceIndex}
                        value={option.optionText}
                        control={<Radio />}
                        label={option.optionText}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
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
                    {exam.scores.length === 0 ? (
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
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => handleViewDetails(exam)}
                        sx={{
                          mt: 2,
                          color: "#207E68",
                          borderColor: "#207E68",
                          "&:hover": {
                            backgroundColor: "#f0f0f0",
                            borderColor: "#1a5b4f",
                          },
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={detailsOpen} onClose={handleCloseDetails}>
        <DialogTitle>Exam Details</DialogTitle>
        <DialogContent>
          {currentExam && (
            <div>
              <Typography variant="h6">{currentExam.title}</Typography>
              <Typography variant="body1">{currentExam.description}</Typography>
              <Typography variant="body2">
                Duration: {currentExam.duration} minutes
              </Typography>
              <Typography variant="body2">
                Total Marks: {currentExam.totalMarks}
              </Typography>
              <Typography variant="body2">
                Pass Marks: {currentExam.passMarks}
              </Typography>
              <Typography variant="h6">Questions:</Typography>
              {currentExam.questions.map((question, index) => (
                <div key={index}>
                  <Typography variant="body2">
                    {index + 1}. {question.questionText}
                  </Typography>
                  {question.options.map((option, optionIndex) => (
                    <Typography variant="body2" key={optionIndex}>
                      - {option.optionText}{" "}
                      {option.isCorrect ? "(Correct)" : ""}
                    </Typography>
                  ))}
                </div>
              ))}
            </div>
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

export default Exam;
