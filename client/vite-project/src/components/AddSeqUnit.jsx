import React, { useState } from 'react';

const AddSeqUnit = () => {
  const [type, setType] = useState('');
  const [code, setCode] = useState('');
  const [poresStart, setPoresStart] = useState('');
  const [poresAfter, setPoresAfter] = useState('');
  const [date, setDate] = useState('');
  const [runId, setRunId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/data/sequencing_unit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, code, pores_start: poresStart, pores_after: poresAfter, date, run_id: runId }),
      });

      const result = await response.json();
      alert(result.message || "Sequencing Unit added successfully!");
    } catch (error) {
      console.error("Error adding sequencing unit:", error);
    }
  };

  return (
    <div>
      <h2>Add Sequencing Unit</h2>
      <form onSubmit={handleSubmit}>
        <label>Type:</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        /><br /><br />

        <label>Code:</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        /><br /><br />

        <label>Pores Start:</label>
        <input
          type="number"
          value={poresStart}
          onChange={(e) => setPoresStart(e.target.value)}
          required
        /><br /><br />

        <label>Pores After:</label>
        <input
          type="number"
          value={poresAfter}
          onChange={(e) => setPoresAfter(e.target.value)}
          required
        /><br /><br />

        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        /><br /><br />

        <label>Run ID:</label>
        <input
          type="number"
          value={runId}
          onChange={(e) => setRunId(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Add Sequencing Unit</button>
      </form>
    </div>
  );
};

export default AddSeqUnit;
