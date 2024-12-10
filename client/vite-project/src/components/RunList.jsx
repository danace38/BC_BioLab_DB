import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import './RunList.css';

const RunList = () => {
  const [experimentName, setExperimentName] = useState('');
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  // Extract experiment ID from the URL search params
  const experimentId = new URLSearchParams(location.search).get('experimentId');

  useEffect(() => {
    if (experimentId) {
      fetchExperimentName(experimentId);  // Fetch experiment name
      fetchRuns(experimentId);            // Fetch runs for the experiment
    } else {
      setError('No Experiment ID Found');
    }
  }, [experimentId]);

  // Fetch experiment name from the API
  const fetchExperimentName = async (experimentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/data/experiment/${experimentId}`);
      const experiment = await response.json();

      if (response.ok && experiment && experiment.name) {
        setExperimentName(experiment.name);
      } else {
        setExperimentName('Experiment Name Not Found');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  // Fetch runs for the experiment from the API
  const fetchRuns = async (experimentId) => {
    try {
      const response = await fetch('http://localhost:8000/api/data/run');
      const allRuns = await response.json();

      if (response.ok) {
        const filteredRuns = allRuns.filter(run => run.experiment_id === parseInt(experimentId));
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
            <th>Run ID</th>
            <th>Start Date</th>
            <th>Computer</th>
            <th>Minion</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id}>
              <td>{run.id}</td>
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

  return (
    <div className="runs-container">
      <Nav />
      <h1>Runs for Experiment</h1>
      <h2>{experimentName ? `Experiment: ${experimentName}` : 'Loading experiment details...'}</h2>
      {error && <p className="error">{error}</p>}
      {renderTable()}
    </div>
  );
};

export default RunList;
