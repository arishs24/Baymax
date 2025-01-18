import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Button, Typography, Card, CardContent } from "@mui/material";

function SignupPage() {
  const { loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) {
    return <Typography align="center">Loading...</Typography>;
  }

  return (
    <div
      style={{
        backgroundImage: `url('/baymax.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Container maxWidth="sm" style={{ display: "flex", flexDirection: "column" }}>
        <Card
          style={{
            padding: "20px",
            borderRadius: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              style={{ marginBottom: "20px", color: "#FF4B4B", fontWeight: "bold" }}
            >
              Welcome to Baymax
            </Typography>
            <Button
              onClick={() => loginWithRedirect({ screen_hint: "signup" })}
              variant="contained"
              fullWidth
              style={{
                backgroundColor: "#4B4BFF",
                color: "#fff",
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >
              Sign Up
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default SignupPage;
