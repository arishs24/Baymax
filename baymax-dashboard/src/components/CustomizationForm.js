import React, { useState } from "react";

function CustomizationForm({ onSave }) {
  const [tone, setTone] = useState("Friendly");
  const [reminderTime, setReminderTime] = useState("09:00");

  const handleSave = () => {
    onSave({ tone, reminderTime });
  };

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Customize Baymax</h3>
      <label>
        Tone of Feedback:
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option value="Friendly">Friendly</option>
          <option value="Professional">Professional</option>
        </select>
      </label>
      <br />
      <label>
        Reminder Time:
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Save Preferences
      </button>
    </div>
  );
}

export default CustomizationForm;
