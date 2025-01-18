// Start Heart Rate Monitoring
document.addEventListener("DOMContentLoaded", function () {
    const hrm = tizen.sensorservice.getDefaultSensor("HRM");
  
    function sendHeartRateToServer(heartRate) {
      fetch("http://your-backend-server.com/api/heart-rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ heartRate }),
      }).catch((error) => console.error("Error sending heart rate:", error));
    }
  
    hrm.start(function onSuccess(data) {
      console.log("Heart Rate:", data.heartRate);
      sendHeartRateToServer(data.heartRate);
    }, function onError(error) {
      console.error("Error starting HRM:", error);
    });
  });
  