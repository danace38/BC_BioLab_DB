import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import AddRun from './AddRun';  // Assuming AddRun handles adding a new run
import AddOperator from './AddOperator';
import AddBarcode from './AddBarcode'; 
import AddLibPrep from './AddLibPrep'; 
import AddSeqUnit from './AddSeqUnit'; 
import './AddRun.css';
import './RunList.css';

const RunList = () => {
  const [experimentName, setExperimentName] = useState('');
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState('');
  const [currentModal, setCurrentModal] = useState(null); // State to track which modal is open
  const location = useLocation();

  // Extract experiment ID and name from the URL search params
  const experimentId = new URLSearchParams(location.search).get('experimentId');
  const experimentNameFromUrl = new URLSearchParams(location.search).get('experimentName');

  useEffect(() => {
    if (experimentId) {
      setExperimentName(experimentNameFromUrl); // Set the experiment name from the URL
      fetchRuns(experimentId); // Fetch runs for the experiment
    } else {
      setError('No Experiment ID Found');
    }
  }, [experimentId, experimentNameFromUrl]);

  // Fetch runs for the experiment from the API
  const fetchRuns = async (experimentId) => {
    try {
      const response = await fetch('http://localhost:8000/api/data/run');
      if (response.ok) {
        const allRuns = await response.json();
        const filteredRuns = allRuns.filter(
          (run) => run.experiment_id === parseInt(experimentId)
        );
        setRuns(filteredRuns);
      } else {
        setError('Failed to load runs');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  // Display runs in a table
  const renderTable = () => {
    if (runs.length === 0) {
      return <p>No runs found for this experiment.</p>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Start Date</th>
            <th>Computer</th>
            <th>Minion</th>
            <th>Notes</th>
            <th>Actions</th> {/* Column for the action buttons */}
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td>{run.date_run_start}</td>
              <td>{run.computer}</td>
              <td>{run.minion}</td>
              <td>{run.notes}</td>
              <td>
                {/* Action buttons for each row */}
                <button onClick={() => openModal('addOperator', run.id)} className="action-button">Add Operator</button>
                <button onClick={() => openModal('addBarcode', run.id)} className="action-button">Add Barcode</button>
                <button onClick={() => openModal('addLibPrep', run.id)} className="action-button">Add Library Prep</button>
                <button onClick={() => openModal('addSeqUnit', run.id)} className="action-button">Add Sequencing Unit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Close any open modal
  const closeModal = () => {
    setCurrentModal(null); // Reset the modal state to close the modal
  };

  // Open the specified modal, and close any other that might be open
  const openModal = (modalName, runId) => {
    setCurrentModal({ modalName, runId }); // Set the modal state to the specified modal name and run ID
  };

  // Handle adding a new run (called from AddRun component)
  const handleAddRun = (newRun) => {
    setRuns([...runs, newRun]); // Add the new run to the list
  };

  return (
    <div className="runs-container">
      <Nav />
      <h1>Runs for Experiment:</h1>
      <div className="header-section">
        <h2>
          <span className="experiment-name">
            {experimentName ? experimentName : 'Loading experiment details...'}
          </span>
        </h2>
        {/* Button to open the "Add Run" modal */}
        <button className="add-run-button" onClick={() => openModal('addRun')}>
          Add Run
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {renderTable()}

      {/* Modals */}
      {currentModal && currentModal.modalName === 'addRun' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <AddRun onClose={closeModal} onSubmit={handleAddRun} /> {/* Pass the handler to AddRun */}
          </div>
        </div>
      )}

      {currentModal && currentModal.modalName === 'addOperator' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <AddOperator runId={currentModal.runId} />
          </div>
        </div>
      )}

      {currentModal && currentModal.modalName === 'addBarcode' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <AddBarcode runId={currentModal.runId} />
          </div>
        </div>
      )}

      {currentModal && currentModal.modalName === 'addLibPrep' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <AddLibPrep runId={currentModal.runId} />
          </div>
        </div>
      )}

      {currentModal && currentModal.modalName === 'addSeqUnit' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <AddSeqUnit runId={currentModal.runId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RunList;
