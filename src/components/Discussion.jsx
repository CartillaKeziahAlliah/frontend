import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";

const Discussion = ({ courseName }) => {
  const [currentDiscussion, setCurrentDiscussion] = useState(0);
  const discussions = ["Discussion 1", "Discussion 2", "Discussion 3"];

  const handleViewDiscussion = (index) => {
    setCurrentDiscussion(index);
  };

  const handleBack = () => {
    setCurrentDiscussion(0);
  };

  return (
    <div>
      <h2>Discussions for {courseName}</h2>
      {currentDiscussion === 0 ? (
        <Grid container spacing={2}>
          {discussions.map((discussion, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                variant="outlined"
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent>
                  <Typography variant="h6">{discussion}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleViewDiscussion(index)}
                    sx={{
                      backgroundColor: "#207E68",
                      "&:hover": {
                        backgroundColor: "#1a5b4f",
                      },
                      color: "#fff",
                      mt: 2,
                    }}
                  >
                    View Discussion
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div>
          <Typography variant="h4" gutterBottom>
            {discussions[currentDiscussion]}
          </Typography>
          <Typography variant="body1" paragraph>
            This is the content for {discussions[currentDiscussion]}.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleBack}
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
            Back to Discussions
          </Button>
        </div>
      )}
    </div>
  );
};

export default Discussion;
