import React, { useState } from "react";
import { auth, db } from "../firebase"; // Import auth and db from firebase.js
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods

function PatientInfoPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [prescription, setPrescription] = useState("");
  const [issue, setIssue] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [issues, setIssues] = useState([]);
  const [message, setMessage] = useState("");

  const handleSaveInfo = async () => {
    try {
      const user = auth.currentUser; // Get the logged-in user
      if (!user) {
        setMessage("User not logged in!");
        return;
      }

      // Save data in a Firestore document for this user's UID
      await setDoc(doc(db, "patients", user.uid), {
        name,
        age,
        prescriptions,
        issues,
      });

      setMessage("Patient information saved successfully!");
      setName("");
      setAge("");
      setPrescriptions([]);
      setIssues([]);
    } catch (error) {
      setMessage("Error saving information: " + error.message);
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

  return (
    <div className="patient-info-container">
      <h1>Manage Patient Information</h1>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Add Prescription:</label>
        <input
          type="text"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
        />
        <button onClick={handleAddPrescription}>Add</button>
      </div>
      <ul>
        {prescriptions.map((prescription, index) => (
          <li key={index}>{prescription}</li>
        ))}
      </ul>
      <div className="form-group">
        <label>Add Health Issue:</label>
        <input
          type="text"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
        <button onClick={handleAddIssue}>Add</button>
      </div>
      <ul>
        {issues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
      <button onClick={handleSaveInfo} className="save-button">
        Save Patient Info
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PatientInfoPage;
