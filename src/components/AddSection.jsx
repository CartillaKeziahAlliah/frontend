import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

export default function MultilineTextFields() {
  const [sectionID, setSectionID] = React.useState("");
  const [sectionName, setSectionName] = React.useState("");

  const handleSectionIDChange = (event) => {
    setSectionID(event.target.value);
  };

  const handleSectionNameChange = (event) => {
    setGradeLevel(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    console.log("Submitted:", { studentName, lRN, section, gradeLevel });
    setSectiotID("");
    setSectiotName("");
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
          id="outlined-section-id"
          label="Section ID"
          value={sectionID}
          onChange={handleSectionIDChange}
          multiline
          maxRows={4}
          variant="outlined"
        />
        <TextField
          id="outlined-section-name"
          label="Section Name"
          value={sectionName}
          onChange={handleSectionNameChange}
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
