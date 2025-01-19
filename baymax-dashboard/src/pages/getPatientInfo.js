const getPatientInfo = async () => {
    try {
      const contract = await connectToContract();
      const patientInfo = await contract.getPatientInfo(); // Replace with your function name
      console.log("Patient Info:", patientInfo);
    } catch (error) {
      console.error("Error fetching patient info:", error);
    }
  };