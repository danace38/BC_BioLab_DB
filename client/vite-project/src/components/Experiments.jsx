import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Experiments.css';
import Nav from '../components/Nav';
import AddParticipant from './AddParticipant'; // Import the AddParticipant component
import AddSample from './AddSample'; // Import the AddSample component

const API_BASE_URL = 'http://localhost:8000/api/data/experiment?limit=50&offset=0';

const Experiments = () => {
  const [experiments, setExperiments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showAddSample, setShowAddSample] = useState(false);
  const [currentExperiment, setCurrentExperiment] = useState(null); // To track which experiment the user is working on
  const [resultMessage, setResultMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();

        if (response.ok) {
          setExperiments(data);
          setError('');
        } else {
          setError('Failed to load experiments');
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  const handleExperimentClick = (experimentId, experimentName) => {
    navigate(`/runs?experimentId=${experimentId}&experimentName=${experimentName}`);
  };

  const handleAddParticipantClick = (experiment) => {
    setCurrentExperiment(experiment); // Set the current experiment to be added to
    setShowAddParticipant(true);
  };

  const handleAddSampleClick = (experiment) => {
    setCurrentExperiment(experiment); // Set the current experiment to be added to
    setShowAddSample(true);
  };

  const closeModal = () => {
    setShowAddParticipant(false);
    setShowAddSample(false);
  };

  const renderContent = () => {
    if (loading) return <p>Loading experiments...</p>;
    if (error) return <p className="error">{error}</p>;
    if (experiments.length === 0) return <p>No experiments found.</p>;

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date Submitted</th>
            <th>Date Started</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {experiments.map((experiment) => (
            <tr key={experiment.id}>
              <td
                onClick={() => handleExperimentClick(experiment.id, experiment.name)}
                style={{ color: 'red', cursor: 'pointer' }}
              >
                {experiment.name}
              </td>
              <td>{experiment.date}</td>
              <td>{experiment.date_started ? experiment.date_started : 'N/A'}</td>
              <td>
  <button 
    onClick={() => handleAddParticipantClick(experiment)} 
    className="simple-button">
    Add Participant
  </button>
  <button 
    onClick={() => handleAddSampleClick(experiment)} 
    className="simple-button">
    Add Sample
  </button>
  </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="experiment-container">
      <Nav />
      <h1>Experiments</h1>
      <p>Hint: Click on the experiment name to view its runs</p>
      <div id="output">{renderContent()}</div>

      {/* Modal for Add Participant */}
      {showAddParticipant && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <AddParticipant
              experiment={currentExperiment}
              onSubmit={(result, message) => setResultMessage(message)}
            />
          </div>
        </div>
      )}

      {/* Modal for Add Sample */}
      {showAddSample && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <AddSample
              experiment={currentExperiment}
              onSubmit={(result, message) => setResultMessage(message)}
            />
          </div>
        </div>
      )}

      {/* Display result message */}
      {resultMessage && <p>{resultMessage}</p>}
    </div>
  );
};

export default Experiments;
