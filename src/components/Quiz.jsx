// Quiz.js
import React, { useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

const Quiz = ({ courseName, user }) => {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "Midterm Quiz",
      score: null,
      answer: "",
    },
    {
      id: 2,
      title: "Final Quiz",
      score: null,
      answer: "",
    },
  ]);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const handleTakeQuiz = (quiz) => {
    setCurrentQuiz(quiz);
  };

  const handleAnswerChange = (value) => {
    const updatedQuizzes = quizzes.map((quiz) => {
      if (quiz.id === currentQuiz.id) {
        return { ...quiz, answer: value };
      }
      return quiz;
    });
    setQuizzes(updatedQuizzes);
  };

  const handleSubmit = () => {
    const updatedQuizzes = quizzes.map(
      (quiz) => (quiz.id === currentQuiz.id ? { ...quiz, score: 85 } : quiz) // Example score
    );
    setQuizzes(updatedQuizzes);
    setCurrentQuiz(null); // Reset to show the list again
  };

  const handleViewScore = (quiz) => {
    alert(quiz.score !== null ? `Your score: ${quiz.score}` : "Not scored yet");
  };

  return (
    <div>
      <h2>Quizzes for {courseName}</h2>
      {user && <p>Student: {user.name}</p>}

      {/* Conditionally render the quizzes or the current quiz form */}
      {!currentQuiz ? (
        <Grid container spacing={2}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <Card
                variant="outlined"
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent>
                  <Typography variant="h6">{quiz.title}</Typography>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="contained"
                      onClick={() => handleTakeQuiz(quiz)}
                      sx={{
                        mt: 2,
                        bgcolor: "#207E68",
                        borderColor: "#207E68",
                        "&:hover": { bgcolor: "#1a5b4f" },
                      }}
                    >
                      Take Quiz
                    </Button>
                    {quiz.score !== null && (
                      <Button
                        variant="outlined"
                        onClick={() => handleViewScore(quiz)}
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
        <div className="quiz-form mt-4">
          <h4>{currentQuiz.title} Quiz Form</h4>
          <TextField
            label="Your Answer"
            variant="outlined"
            fullWidth
            multiline
            value={currentQuiz.answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="mt-2"
            sx={{
              mt: 2,
              bgcolor: "#207E68",
              borderColor: "#207E68",
              "&:hover": { bgcolor: "#1a5b4f" },
            }}
          >
            Submit Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
