import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";

// const apiUrl = "http://localhost:5000";
const apiUrl = "https://server-production-dd7a.up.railway.app";
const Quiz = ({ subjectId, user }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/quiz/bysubject/${subjectId}`
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [subjectId]);

  const handleTakeQuiz = async (quiz) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/quiz/check-quiz-attempt/${user.id}/${quiz.id}`
      );

      if (response.data.hasTakenQuiz) {
        alert("You have already taken this quiz.");
      } else {
        setCurrentQuiz(quiz);
      }
    } catch (error) {
      console.error("Error checking quiz attempt:", error);
    }
  };

  const handleAnswerChange = (value) => {
    setUserAnswers({ ...userAnswers, [currentQuiz.id]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/quiz/submit/${currentQuiz.id}/${user.id}`,
        {
          userAnswers: userAnswers[currentQuiz.id],
        }
      );

      const updatedQuiz = {
        ...currentQuiz,
        score: response.data.obtainedMarks,
      };
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) =>
          quiz.id === updatedQuiz.id ? updatedQuiz : quiz
        )
      );
      setCurrentQuiz(null);
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuiz.id]: "",
      })); // Clear answer
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleViewScore = (quiz) => {
    alert(quiz.score !== null ? `Your score: ${quiz.score}` : "Not scored yet");
  };

  return (
    <div>
      <h2>Quizzes for Subject {subjectId}</h2>
      {user && <p>Student: {user.name}</p>}

      {!currentQuiz ? (
        <Grid container spacing={2}>
          {quizzes.map((quiz, index) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id || index}>
              <Card
                variant="outlined"
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent>
                  <Typography variant="h6">{quiz.title}</Typography>
                  <div className="flex gap-2 mt-2">
                    {quiz.score === null ? (
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
                    ) : (
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
            value={userAnswers[currentQuiz.id] || ""}
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
