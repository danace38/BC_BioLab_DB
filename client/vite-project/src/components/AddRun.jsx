import React, { useState } from 'react';

const AddRun = () => {
  const [dateRunStart, setDateRunStart] = useState('');
  const [experimentId, setExperimentId] = useState('');
  const [computer, setComputer] = useState('');
  const [minion, setMinion] = useState('');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddRun = async (e) => {
    e.preventDefault();

    const runData = {
      date_run_start: dateRunStart,
      experiment_id: experimentId,
      computer,
      minion,
      notes,
    };

    try {
      const response = await fetch('http://localhost:8000/api/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runData),
      });

      if (response.ok) {
        setSuccessMessage('Run added successfully!');
        setErrorMessage('');
        clearForm();
      } else {
        const errorData = await response.json();
        setErrorMessage(`Failed to add run: ${errorData.message || 'Unknown error'}`);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
      setSuccessMessage('');
    }
  };

  const clearForm = () => {
    setDateRunStart('');
    setExperimentId('');
    setComputer('');
    setMinion('');
    setNotes('');
  };

  return (
    <div className="add-run-container">
      <h1>Add New Run</h1>
      <form onSubmit={handleAddRun}>
        <div className="form-group">
          <label htmlFor="dateRunStart">Run Start Date:</label>
          <input
            type="date"
            id="dateRunStart"
            value={dateRunStart}
            onChange={(e) => setDateRunStart(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="experimentId">Experiment ID:</label>
          <input
            type="number"
            id="experimentId"
            value={experimentId}
            onChange={(e) => setExperimentId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="computer">Computer:</label>
          <input
            type="text"
            id="computer"
            value={computer}
            onChange={(e) => setComputer(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="minion">Minion:</label>
          <input
            type="text"
            id="minion"
            value={minion}
            onChange={(e) => setMinion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Add Run</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default AddRun;
