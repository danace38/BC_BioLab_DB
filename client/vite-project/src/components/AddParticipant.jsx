import React, { useState } from 'react';

const AddParticipant = ({ onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/data/participant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name.trim() }),
            });

            const result = await response.json();
            const successMessage = response.ok ? "Participant added successfully!" : "Failed to add participant.";
            onSubmit(result, successMessage);
        } catch (error) {
            onSubmit(null, `Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Add Participant</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="participantName">Participant Name:</label>
                <input
                    type="text"
                    id="participantName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddParticipant;