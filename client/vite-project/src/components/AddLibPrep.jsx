import React, { useState } from 'react';

const AddLibPrep = () => {
  const [prepKit, setPrepKit] = useState('');
  const [dateOpened, setDateOpened] = useState('');
  const [sampleNum, setSampleNum] = useState('');
  const [owner, setOwner] = useState('');
  const [runId, setRunId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const libraryPrepData = { prep_kit: prepKit, date_opened: dateOpened, sample_num: sampleNum, owner, run_id: runId };

    try {
      const response = await fetch("http://localhost:8000/api/data/library_prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(libraryPrepData),
      });

      const result = await response.json();
      alert(result.message || "Library Prep added successfully!");
    } catch (error) {
      console.error("Error adding library prep:", error);
    }
  };

  return (
    <div className="add-libprep-container">
      <h2>Add Library Prep</h2>
      <form onSubmit={handleSubmit}>
        <label>Prep Kit:</label>
        <input
          type="text"
          id="prep_kit"
          value={prepKit}
          onChange={(e) => setPrepKit(e.target.value)}
          required
        />
        <br />
        <br />
        <label>Date Opened:</label>
        <input
          type="date"
          id="date_opened"
          value={dateOpened}
          onChange={(e) => setDateOpened(e.target.value)}
          required
        />
        <br />
        <br />
        <label>Sample Number:</label>
        <input
          type="number"
          id="sample_num"
          value={sampleNum}
          onChange={(e) => setSampleNum(e.target.value)}
          required
        />
        <br />
        <br />
        <label>Owner:</label>
        <input
          type="text"
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          required
        />
        <br />
        <br />
        <label>Run ID:</label>
        <input
          type="number"
          id="run_id"
          value={runId}
          onChange={(e) => setRunId(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Add Library Prep</button>
      </form>
    </div>
  );
};

export default AddLibPrep;
