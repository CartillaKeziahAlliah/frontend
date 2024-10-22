import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

export default function MultilineTextFields() {
  const [gradeID, setGradeID] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState("");

  const handleGradeIDChange = (event) => {
    setGradeID(event.target.value);
  };

  const handleGradeLevelChange = (event) => {
    setGradeLevel(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted:", { gradeID, gradeLevel });
    setGradeID("");
    setGradeLevel("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-grade-id"
          label="Grade ID"
          value={gradeID}
          onChange={handleGradeIDChange}
          multiline
          maxRows={4}
          variant="outlined"
        />
        <TextField
          id="outlined-section-name"
          label="Grade Level"
          value={gradeLevel}
          onChange={handleGradeLevelChange}
          multiline
          maxRows={4}
          variant="outlined"
        />
      </div>

      {/* Submit Button */}
      <Button variant="contained" type="submit" sx={{ m: 1 }} color="primary">
        Add Section
      </Button>
    </Box>
  );
}
