import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// Define your API URL
const apiUrl = "http://localhost:5000";

const Exam = ({ subjectId, user, subject }) => {
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [takeExam, setTakeExam] = useState(false);
  const [viewScore, setViewScore] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for the menu
  const [selectedExam, setSelectedExam] = useState(null); // Track selected exam for menu actions
  const [timeLeft, setTimeLeft] = useState(0); // Track remaining time
  const [timerActive, setTimerActive] = useState(false); // To control the timer state

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

  const handleTakeExam = (exam) => {
    setCurrentExam(exam);
    setTakeExam(true);
    setAnswers({});
    handleCloseMenu();

    // Initialize the timer with the exam duration (converted to milliseconds)
    setTimeLeft(exam.duration * 60); // duration in minutes * 60 seconds
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
      // Submit the answers, allowing empty answers if not filled out
      const response = await axios.post(
        `${apiUrl}/api/exam/${currentExam._id}/take`,
        {
          studentId: user._id,
          answers:
            Object.values(answers).length > 0 ? Object.values(answers) : null, // Submit answers or null
        }
      );

      const updatedExams = exams.map((exam) =>
        exam._id === currentExam._id
          ? { ...exam, score: response.data.obtainedMarks }
          : exam
      );
      setExams(updatedExams);
      setCurrentExam(null);

      alert(
        `Exam submitted! Your score: ${response.data.obtainedMarks}/${
          response.data.totalMarks
        }. Passed: ${response.data.passed ? "Yes" : "No"}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to submit exam:", error);
    }
  };

  const handleOpenMenu = (event, exam) => {
    setAnchorEl(event.currentTarget);
    setSelectedExam(exam);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedExam(null);
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

  // Function to format timeLeft into MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div>
      {currentExam && takeExam ? (
        <div>
          <button onClick={() => setTakeExam(false)}>Back</button>
          <h4>{currentExam.title} Questions</h4>
          <Typography variant="h6">
            Time Left: {formatTime(timeLeft)}
          </Typography>
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
            Submit Exam
          </Button>
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
              {exams.map((exam) => (
                <TableRow key={exam._id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.duration} mins.</TableCell>

                  <TableCell align="right">
                    {exam.scores.some(
                      (score) =>
                        score.studentId._id.toString() === user._id.toString()
                    ) ? (
                      <Typography color="green">Completed</Typography>
                    ) : (
                      <>
                        <IconButton onClick={(e) => handleOpenMenu(e, exam)}>
                          <MoreHorizIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(
                            anchorEl && selectedExam?._id === exam._id
                          )}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={() => handleTakeExam(exam)}>
                            Take Exam
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
    </div>
  );
};

export default Exam;
