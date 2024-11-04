import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { CheckOutlined, Close } from "@mui/icons-material";

const apiUrl = "http://localhost:5000";

// Function to check if the user has already taken the quiz
const checkQuizAttempt = async (userId, quizId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/quiz/check-quiz-attempt/${userId}/${quizId}`
    );
    return response.data.hasTakenQuiz; // Assumes API response includes a boolean for hasTakenQuiz
  } catch (error) {
    console.error("Error checking quiz attempt:", error);
    return false;
  }
};

const QuizView = ({ quiz, onClose }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleAnswerChange = (questionIndex, optionIndex) => {
    if (isLocked) {
      setUserAnswers((prev) => ({
        ...prev,
        [questionIndex]: optionIndex,
      }));
    }
  };
  const fetchScores = async () => {
    try {
      const response = await axios.get(`/api/quiz/scores/${user._id}`);
      setScores(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitQuiz = async () => {
    Swal.fire({
      title: "Submit Quiz?",
      text: "Are you sure you want to submit your quiz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit!",
      cancelButtonText: "No, go back!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const submissionData = {
          quizId: quiz._id,
          userId: user._id,
          userAnswers,
        };

        try {
          const response = await axios.post(
            `${apiUrl}/api/quiz/submit/${quiz._id}/${user._id}`,
            submissionData
          );

          const { obtainedMarks, totalMarks, passed } = response.data;
          Swal.fire(
            "Quiz Submitted!",
            `You scored ${obtainedMarks} out of ${totalMarks}. You ${
              passed ? "passed" : "failed"
            } the quiz.`,
            "success"
          );
          onClose();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Submission Failed",
            "There was an error submitting your quiz. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const handleStartQuiz = () => {
    setIsLocked(true);
    startTimer();
  };

  const startTimer = () => {
    const totalTime = quiz.duration * 60;
    setRemainingTime(totalTime);

    const timerId = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    const checkAttemptAndFetchResults = async () => {
      if (user?.role === "student") {
        const hasTaken = await checkQuizAttempt(user._id, quiz._id);
        setHasTakenQuiz(hasTaken);
        if (hasTaken) {
          fetchScores();
        }
      }
    };

    checkAttemptAndFetchResults();

    const handleBeforeUnload = (event) => {
      if (isLocked) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLocked, user, quiz]);

  return (
    <Box
      sx={{
        marginTop: 3,
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <div className="flex flex-row justify-between">
        <Typography variant="h6">
          {user.role === "student" ? "Quiz" : "Quiz Details"}
        </Typography>
        <Close className="cursor-pointer" onClick={onClose} />
      </div>
      <div className="py-2 flex flex-row flex-wrap w-full justify-between">
        <div className="flex flex-row items-center gap-1 capitalize">
          <Typography variant="body1" fontWeight="bold">
            Title:
          </Typography>
          <Typography variant="body2">{quiz.title}</Typography>
        </div>
        <div className="flex flex-row items-center gap-1 capitalize">
          <Typography variant="body1" fontWeight="bold">
            Description:
          </Typography>
          <Typography variant="body2">{quiz.description}</Typography>
        </div>
        <div className="flex flex-row items-center gap-1 capitalize">
          <Typography variant="body1" fontWeight="bold">
            Duration:
          </Typography>
          <Typography variant="body2">{quiz.duration} minutes</Typography>
        </div>
        <div className="flex flex-row items-center gap-1 capitalize">
          <Typography variant="body1" fontWeight="bold">
            Total Marks:
          </Typography>
          <Typography variant="body2">{quiz.totalMarks}</Typography>
        </div>
        <div className="flex flex-row items-center gap-1 capitalize">
          <Typography variant="body1" fontWeight="bold">
            Deadline:
          </Typography>
          <Typography variant="body2">
            {new Date(quiz.deadline).toLocaleDateString()}
          </Typography>
        </div>
      </div>

      {hasTakenQuiz ? (
        <>
          <div
            style={{ padding: 6, borderRadius: 10 }}
            className={quiz.scores[0]?.passed ? `bg-green-200` : "bg-red-500"}
          >
            <div className="flex flex-row items-center">
              <Typography
                variant="h5"
                textAlign="center"
                color={quiz.scores[0]?.passed ? "green" : "red"}
              >
                {quiz.scores[0].passed ? "Passed" : "Failed"}
              </Typography>
            </div>
            <Typography variant="body1">
              {`Score: ${quiz.scores[0].obtainedMarks} / ${quiz.totalMarks}`}
            </Typography>

            <Typography variant="body2">
              Date Taken: <span></span>
              {new Date(quiz.scores[0].examDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </div>
          <br />
          <ul className="flex flex-col gap-2">
            {quiz.questions.map((question, index) => (
              <li key={index}>
                <Typography variant="body2" className="shadow-md">
                  {index + 1}. {question.questionText}
                  <ul>
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex}>
                        <Typography
                          variant="body2"
                          color={
                            option.isCorrect
                              ? "green"
                              : userAnswers[index] === optIndex
                              ? "red"
                              : "inherit"
                          }
                        >
                          {option.optionText}
                          {option.isCorrect && (
                            <>
                              <CheckOutlined />
                            </>
                          )}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Typography>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          {isLocked && (
            <Typography
              variant="h5"
              color="error"
              textAlign="center"
              sx={{ marginTop: 2 }}
            >
              Time Remaining: {formatTime(remainingTime)}
            </Typography>
          )}
          <Typography variant="body1" fontWeight="bold">
            Questions:
          </Typography>
          {quiz.questions.length > 0 ? (
            <ul>
              {quiz.questions.map((question, index) => (
                <li key={index}>
                  <Typography variant="body2" className="capitalize">
                    {index + 1}. {question.questionText}
                    <br />
                    <ul>
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex}>
                          <label>
                            <input
                              type="radio"
                              name={`question-${index}`}
                              checked={userAnswers[index] === optIndex}
                              onChange={() =>
                                handleAnswerChange(index, optIndex)
                              }
                            />
                            {option.optionText}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">No questions found.</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default QuizView;
