import React, { useState } from 'react';

const AddSample = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/data/samples', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name.trim(), code: code.trim() }),
            });

            const result = await response.json();
            const successMessage = response.ok ? "Sample added successfully!" : "Failed to add sample.";
            onSubmit(result, successMessage);
        } catch (error) {
            onSubmit(null, `Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Add Sample</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="sampleName">Sample Name:</label>
                <input
                    type="text"
                    id="sampleName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label htmlFor="sampleCode">Sample Code:</label>
                <input
                    type="text"
                    id="sampleCode"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Add Sample</button>
            </form>
        </div>
    );
};

export default AddSample;
