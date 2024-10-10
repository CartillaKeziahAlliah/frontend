import React, { useState } from "react";
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
} from "@mui/material";

const Exam = ({ courseName, user }) => {
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "Midterm Exam",
      questions: [
        {
          type: "text",
          question: "What is the capital of France?",
          answer: "",
        },
        {
          type: "multiple",
          question: "Select the correct colors:",
          choices: ["Red", "Blue", "Green"],
          answer: "",
        },
      ],
      score: null,
    },
    {
      id: 2,
      title: "Final Exam",
      questions: [
        { type: "text", question: "Explain Newton's first law.", answer: "" },
        {
          type: "multiple",
          question: "Choose the programming languages:",
          choices: ["JavaScript", "HTML", "CSS", "Python"],
          answer: "",
        },
      ],
      score: null,
    },
  ]);
  const [currentExam, setCurrentExam] = useState(null);

  const handleTakeExam = (exam) => {
    setCurrentExam(exam);
  };

  const handleAnswerChange = (index, value) => {
    const updatedExams = exams.map((exam) => {
      if (exam.id === currentExam.id) {
        const updatedQuestions = [...exam.questions];
        updatedQuestions[index].answer = value;
        return { ...exam, questions: updatedQuestions };
      }
      return exam;
    });
    setExams(updatedExams);
  };

  const handleSubmit = () => {
    const updatedExams = exams.map((exam) =>
      exam.id === currentExam.id ? { ...exam, score: 90 } : exam
    );
    setExams(updatedExams);
    setCurrentExam(null);
  };

  const handleViewScore = (exam) => {
    alert(exam.score !== null ? `Your score: ${exam.score}` : "Not scored yet");
  };

  return (
    <div>
      <h2>Exams for {courseName}</h2>
      {user && <p>Student: {user.name}</p>}

      {currentExam ? (
        <div>
          <h4>{currentExam.title} Questions</h4>
          {currentExam.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p>{question.question}</p>
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
                    {question.choices.map((choice, choiceIndex) => (
                      <FormControlLabel
                        key={choiceIndex}
                        value={choice}
                        control={<Radio />}
                        label={choice}
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
            <Grid item xs={12} sm={6} md={4} key={exam.id}>
              <Card
                variant="outlined"
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent>
                  <Typography variant="h6">{exam.title}</Typography>
                  <div className="flex gap-2 mt-2">
                    {exam.score === null ? (
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
                        onClick={() => handleViewScore(exam)}
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
      )}
    </div>
  );
};

export default Exam;
