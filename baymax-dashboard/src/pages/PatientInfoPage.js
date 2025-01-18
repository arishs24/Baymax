import React, { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth0 } from "@auth0/auth0-react";

import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Stack,
} from "@mui/material";

// Icons
import MedicationIcon from "@mui/icons-material/Medication";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function PatientInfoPage() {
  const { user } = useAuth0();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [prescription, setPrescription] = useState("");
  const [issue, setIssue] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [issues, setIssues] = useState([]);
  const [message, setMessage] = useState("");

  const handleSaveInfo = async () => {
    try {
      if (!user) return;
      const userId = user.sub; // Auth0 user ID
      console.log("Saving data for user ID:", userId);

      await setDoc(doc(db, "patients", userId), {
        name,
        age,
        prescriptions,
        issues,
      });

      console.log("Data saved successfully!");
      setMessage("Patient information saved successfully!");
    } catch (err) {
      console.error("Error saving data:", err.message);
      setMessage("Error saving information: " + err.message);
    }
  };

  const handleAddPrescription = () => {
    if (prescription.trim()) {
      setPrescriptions([...prescriptions, prescription]);
      setPrescription("");
    }
  };

  const handleAddIssue = () => {
    if (issue.trim()) {
      setIssues([...issues, issue]);
      setIssue("");
    }
  };

  const handleRemovePrescription = (indexToRemove) => {
    setPrescriptions((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveIssue = (indexToRemove) => {
    setIssues((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <Box
      // Full-page background
      sx={{
        minHeight: "100vh",
        // This points to baymax.jpg in your public folder
        backgroundImage: "url('/baymax.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // Add an optional overlay color if desired:
        // backgroundColor: "rgba(255, 255, 255, 0.7)",
        // backgroundBlendMode: "lighten",
        py: 8, // Space above and below
      }}
    >
      {/* Center your content in a Container */}
      <Container maxWidth="md">
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 3,
            color: "#FF4B4B",
            fontWeight: "bold",
            fontFamily: "'Fredoka', sans-serif",
          }}
        >
          Baymax Patient Info
        </Typography>

        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Grid container spacing={3}>
              {/* Name Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputLabelProps={{ sx: { color: "#FF4B4B" } }}
                />
              </Grid>

              {/* Age Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Age"
                  fullWidth
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  InputLabelProps={{ sx: { color: "#FF4B4B" } }}
                />
              </Grid>

              {/* Prescriptions Section */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#4B4BFF", fontWeight: "bold" }}
                >
                  Prescriptions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      label="Add Prescription"
                      fullWidth
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#FF4B4B",
                        color: "#ffffff",
                        borderRadius: 2,
                        fontWeight: "bold",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                      onClick={handleAddPrescription}
                      fullWidth
                    >
                      <AddIcon fontSize="small" />
                      Add
                    </Button>
                  </Grid>
                </Grid>

                {/* Display prescriptions as Chips */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: "wrap" }}
                >
                  {prescriptions.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      icon={<MedicationIcon />}
                      onDelete={() => handleRemovePrescription(index)}
                      deleteIcon={<DeleteIcon />}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Grid>

              {/* Health Issues Section */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#4B4BFF", fontWeight: "bold" }}
                >
                  Health Issues
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      label="Add Health Issue"
                      fullWidth
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#FF4B4B",
                        color: "#ffffff",
                        borderRadius: 2,
                        fontWeight: "bold",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                      onClick={handleAddIssue}
                      fullWidth
                    >
                      <AddIcon fontSize="small" />
                      Add
                    </Button>
                  </Grid>
                </Grid>

                {/* Display issues as Chips */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: "wrap" }}
                >
                  {issues.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      icon={<MedicalServicesIcon />}
                      onDelete={() => handleRemoveIssue(index)}
                      deleteIcon={<DeleteIcon />}
                      color="secondary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Grid>

              {/* Save Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4B4BFF",
                    color: "#ffffff",
                    borderRadius: 3,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    py: 1.5,
                  }}
                  fullWidth
                  onClick={handleSaveInfo}
                >
                  Save Patient Info
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Success/Error Alert */}
        {message && (
          <Alert
            severity={message.includes("Error") ? "error" : "success"}
            sx={{
              mt: 3,
              fontWeight: "bold",
            }}
          >
            {message}
          </Alert>
        )}
      </Container>
    </Box>
  );
}

export default PatientInfoPage;
