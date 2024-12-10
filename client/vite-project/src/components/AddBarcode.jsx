import React, { useState } from 'react';

const AddBarcode = () => {
  const [sampleName, setSampleName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [runId, setRunId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const barcodeData = { sample_name: sampleName, barcode, run_id: runId };

    try {
      const response = await fetch("http://localhost:8000/api/data/barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(barcodeData),
      });

      const result = await response.json();
      alert(result.message || "Barcode added successfully!");
    } catch (error) {
      console.error("Error adding barcode:", error);
    }
  };

  return (
    <div className="add-barcode-container">
      <h2>Add Barcode</h2>
      <form onSubmit={handleSubmit}>
        <label>Sample Name:</label>
        <input
          type="text"
          id="sample_name"
          value={sampleName}
          onChange={(e) => setSampleName(e.target.value)}
          required
        />
        <br />
        <br />
        <label>Barcode:</label>
        <input
          type="text"
          id="barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
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
        <button type="submit">Add Barcode</button>
      </form>
    </div>
  );
};

export default AddBarcode;
