import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import AddRun from './AddRun';
import AddOperator from './AddOperator';
import AddBarcode from './AddBarcode'; // Import AddBarcode
import AddLibPrep from './AddLibPrep'; // Import AddLibPrep
import AddSeqUnit from './AddSeqUnit'; // Import AddSeqUnit
import './AddRun.css';
import './RunList.css';

const RunList = () => {
  const [experimentName, setExperimentName] = useState('');
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState('');
  const [showAddRunModal, setShowAddRunModal] = useState(false); // State for AddRun modal
  const [showAddOperatorModal, setShowAddOperatorModal] = useState(false); // State for AddOperator modal
  const [showAddBarcodeModal, setShowAddBarcodeModal] = useState(false); // State for AddBarcode modal
  const [showAddLibPrepModal, setShowAddLibPrepModal] = useState(false); // State for AddLibPrep modal
  const [showAddSeqUnitModal, setShowAddSeqUnitModal] = useState(false); // State for AddSeqUnit modal
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
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td>{run.date_run_start}</td>
              <td>{run.computer}</td>
              <td>{run.minion}</td>
              <td>{run.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const closeModal = (setModalState) => {
    setModalState(false); // Close modal when called
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
        <div className="buttons-group">
          <button className="add-run-button" onClick={() => setShowAddRunModal(true)}>
            Add Run
          </button>
          <button
            className="add-operator-button"
            onClick={() => setShowAddOperatorModal(true)}
          >
            Add Operator
          </button>
          <button
            className="add-barcode-button"
            onClick={() => setShowAddBarcodeModal(true)}
          >
            Add Barcode
          </button>
          <button
            className="add-libprep-button"
            onClick={() => setShowAddLibPrepModal(true)}
          >
            Add Library Prep
          </button>
          <button
            className="add-sequencing-unit-button"
            onClick={() => setShowAddSeqUnitModal(true)}
          >
            Add Sequencing Unit
          </button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {renderTable()}

      {/* Modals */}
      {showAddRunModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => closeModal(setShowAddRunModal)}>
              &times;
            </button>
            <AddRun />
          </div>
        </div>
      )}

      {showAddOperatorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => closeModal(setShowAddOperatorModal)}>
              &times;
            </button>
            <AddOperator />
          </div>
        </div>
      )}

      {showAddBarcodeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => closeModal(setShowAddBarcodeModal)}>
              &times;
            </button>
            <AddBarcode />
          </div>
        </div>
      )}

      {showAddLibPrepModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => closeModal(setShowAddLibPrepModal)}>
              &times;
            </button>
            <AddLibPrep />
          </div>
        </div>
      )}

      {showAddSeqUnitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => closeModal(setShowAddSeqUnitModal)}>
              &times;
            </button>
            <AddSeqUnit />
          </div>
        </div>
      )}
    </div>
  );
};

export default RunList;
