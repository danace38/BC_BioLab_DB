import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import './RunList.css';

const RunList = () => {
  const [experimentName, setExperimentName] = useState('');
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  // Extract experiment ID and name from the URL search params
  const experimentId = new URLSearchParams(location.search).get('experimentId');
  const experimentNameFromUrl = new URLSearchParams(location.search).get('experimentName'); // Extract experiment name from query
  console.log('Experiment ID:', experimentId); // Log for debugging

  useEffect(() => {
    if (experimentId) {
      setExperimentName(experimentNameFromUrl); // Set the experiment name from the URL
      fetchRuns(experimentId);                   // Fetch runs for the experiment
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
      <h1>Runs for Experiment:</h1>
      <h2>
        <span className="experiment-name">
           {experimentName ? experimentName : 'Loading experiment details...'}
           </span>
           </h2>
      {error && <p className="error">{error}</p>}
      {renderTable()}
    </div>
  );
};

export default RunList;
