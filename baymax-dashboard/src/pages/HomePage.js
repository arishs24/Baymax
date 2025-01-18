import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion"; // For animations
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "../App.css";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const AnimatedCard = styled(motion.div)(({ theme }) => ({
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
}));

function HomePage({ mode = "child" }) {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch patient data using Auth0 user information
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const userId = user.sub;
        const docRef = doc(db, "patients", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPatient(docSnap.data());
        } else {
          setError("No patient information found.");
        }
      } catch (err) {
        setError("Error fetching patient data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user, isAuthenticated]);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Prescriptions Over Time",
        data: [5, 10, 15, 10, 20, 25],
        backgroundColor: "rgba(99, 132, 255, 0.2)",
        borderColor: "rgba(99, 132, 255, 1)",
        borderWidth: 2,
        pointBackgroundColor: "#FF4B4B",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const renderModeGreeting = () => {
    switch (mode) {
      case "child":
        return "Welcome, young explorer! Let's learn about health together! 🚀";
      case "adult":
        return "Your health journey starts here. Stay informed and empowered!";
      case "doctor":
        return "Welcome, Doctor. Here's your patient analytics overview.";
      default:
        return "Welcome! Please select a mode to continue.";
    }
  };

  if (isLoading || loading) {
    return (
      <Typography variant="h5" align="center" style={{ marginTop: "50px", color: "#5e72e4" }}>
        Loading patient data...
      </Typography>
    );
  }

  if (!isAuthenticated) {
    return (
      <Typography variant="h6" align="center" style={{ marginTop: "50px", color: "#5e72e4" }}>
        Please log in to access your dashboard.
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" style={{ marginTop: "50px", color: "#FF4B4B" }}>
        {error}
      </Typography>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(99, 132, 255, 0.1), rgba(245, 245, 245, 0.8)), url('/baymaxy.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={4}
          style={{
            padding: "40px",
            borderRadius: "25px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            style={{
              color: "#FF4B4B",
              fontWeight: "bold",
              marginBottom: "20px",
              fontFamily: "'Fredoka', sans-serif",
            }}
          >
            Baymax Patient Dashboard
          </Typography>
          <Typography
            variant="h6"
            align="center"
            style={{ marginBottom: "40px", color: "#5e72e4", fontStyle: "italic" }}
          >
            {renderModeGreeting()}
          </Typography>

          {patient && (
            <>
              {/* User Info Section */}
              <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} sm={6} md={3}>
                  <AnimatedCard
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          style={{ color: "#4B4BFF", fontWeight: "bold", textAlign: "center" }}
                        >
                          Name
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{ fontSize: "1.8rem", textAlign: "center", color: "#333" }}
                        >
                          {patient.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <AnimatedCard
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          style={{ color: "#4B4BFF", fontWeight: "bold", textAlign: "center" }}
                        >
                          Age
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{ fontSize: "1.8rem", textAlign: "center", color: "#333" }}
                        >
                          {patient.age}
                        </Typography>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <AnimatedCard
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          style={{ color: "#4B4BFF", fontWeight: "bold", textAlign: "center" }}
                        >
                          Prescriptions
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{ fontSize: "1.8rem", textAlign: "center", color: "#333" }}
                        >
                          {patient.prescriptions.length} total
                        </Typography>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </Grid>
              </Grid>

              <Divider style={{ margin: "40px 0" }} />

              {/* Chart Section */}
              <AnimatedCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card
                  style={{
                    padding: "20px",
                    borderRadius: "20px",
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{
                      color: "#FF4B4B",
                      fontWeight: "bold",
                      marginBottom: "20px",
                      textAlign: "center",
                    }}
                  >
                    Prescriptions Over Time
                  </Typography>
                  <Line data={chartData} options={chartOptions} />
                </Card>
              </AnimatedCard>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default HomePage;
