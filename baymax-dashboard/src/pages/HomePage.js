import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function HomePage() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const user = auth.currentUser; // Get the logged-in user
        if (!user) {
          setError("User not logged in!");
          return;
        }

        // Fetch data for this user's UID
        const docRef = doc(db, "patients", user.uid);
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
  }, []);

  if (loading) {
    return <p>Loading patient data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-container">
      <h1>Patient Dashboard</h1>
      {patient ? (
        <div className="patient-card">
          <h2>{patient.name}</h2>
          <p><strong>Age:</strong> {patient.age}</p>
          <h3>Prescriptions:</h3>
          <ul>
            {patient.prescriptions.map((prescription, index) => (
              <li key={index}>{prescription}</li>
            ))}
          </ul>
          <h3>Health Issues:</h3>
          <ul>
            {patient.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No patient data found.</p>
      )}
    </div>
  );
}

export default HomePage;
