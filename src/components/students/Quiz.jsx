import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAuth } from "../../context/AuthContext";

import { Close } from "@mui/icons-material";

// const apiUrl = "http://localhost:5000";
const apiUrl = "https://server-production-dd7a.up.railway.app";
const Quiz = ({ subjectId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [takeQuiz, setTakeQuiz] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for the menu
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Track selected quiz for menu actions
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0); // Track remaining time
  const [timerActive, setTimerActive] = useState(false); // To control the timer state
  const [openResultDialog, setOpenResultDialog] = useState(false); // For dialog state
  const [quizResult, setQuizResult] = useState(null); // Store quiz result

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/quiz/bysubject/${subjectId}`
        );
        const sortedQuiz = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setQuizzes(sortedQuiz);
        console.log("Quiz fetched:", response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [subjectId]);

  const handleTakeQuiz = async (quiz) => {
    setCurrentQuiz(quiz);
    setTakeQuiz(true);
    setAnswers({});
    handleCloseMenu();
    setTimeLeft(quiz.duration * 60); // duration in minutes * 60 seconds
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
        `${apiUrl}/api/quiz/${currentQuiz._id}/take`,
        {
          studentId: user._id,
          answers: Object.values(answers),
        }
      );

      const updatedQuiz = quizzes.map((quiz) =>
        quiz._id === currentQuiz._id
          ? { ...quiz, score: response.data.obtainedMarks }
          : quiz
      );
      setQuizzes(updatedQuiz);
      setCurrentQuiz(null);
      setQuizResult(response.data); // Set result data for dialog
      setOpenResultDialog(true); // Open dialog
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleCloseResultDialog = () => {
    setOpenResultDialog(false);
    window.location.reload(); // Reload page to reflect changes
  };

  const handleOpenMenu = (event, quiz) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuiz(quiz);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedQuiz(null);
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
      {currentQuiz && takeQuiz ? (
        <div>
          <button onClick={() => setTakeQuiz(false)}>back</button>
          <h4>{currentQuiz.title} Questions</h4>
          <Typography variant="h6">
            Time Left: {formatTime(timeLeft)}
          </Typography>
          {currentQuiz.questions.map((question, index) => (
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
            Submit quiz
          </Button>{" "}
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead bgcolor="#cdcdcd">
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz._id}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.duration}</TableCell>
                  <TableCell align="right">
                    {quiz.scores.some(
                      (score) => score.studentId === user._id
                    ) ? (
                      <Typography color="green">Completed </Typography>
                    ) : (
                      <>
                        <IconButton onClick={(e) => handleOpenMenu(e, quiz)}>
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(
                            anchorEl && selectedQuiz?._id === quiz._id
                          )}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => handleTakeQuiz(quiz)}>
                            Take quiz
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

      {/* Result Dialog */}
      <Dialog
        open={openResultDialog}
        onClose={handleCloseResultDialog}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { width: "50%" },
          textAlign: "center",
        }}
      >
        <DialogActions>
          <Button onClick={handleCloseResultDialog} color="primary">
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
          <DialogContentText variant="h2">
            {quizResult?.obtainedMarks}/{quizResult?.totalMarks}
          </DialogContentText>
          <Typography
            variant="h2"
            sx={{ color: quizResult?.passed ? "green" : "red" }}
          >
            {quizResult?.passed ? "PASSED" : "FAILED"}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quiz;
