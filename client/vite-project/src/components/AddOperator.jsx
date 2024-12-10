import React, { useState, useEffect } from 'react';

const AddOperator = () => {
  const [role, setRole] = useState('');
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [runId, setRunId] = useState('');
  const [message, setMessage] = useState('');

  // Load participants from the API on component mount
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/data/participant');
        if (!response.ok) {
          throw new Error('Failed to load participants');
        }
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error('Error loading participants:', error);
        alert('Failed to load participants.');
      }
    };

    loadParticipants();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/data/operator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          participant_id: selectedParticipant,
          run_id: runId,
        }),
      });

      const result = await response.json();
      setMessage(result.message || 'Operator added successfully!');
    } catch (error) {
      console.error('Error adding operator:', error);
      setMessage('Failed to add operator.');
    }
  };

  return (
    <div>
      <h2>Add Operator</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="participant_id">Participant Name:</label>
          <select
            id="participant_id"
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a participant
            </option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label htmlFor="run_id">Run ID:</label>
          <input
            type="number"
            id="run_id"
            value={runId}
            onChange={(e) => setRunId(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Add Operator</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddOperator;
