import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Experiments.css';
import Nav from '../components/Nav';

const API_BASE_URL = 'http://localhost:8000/api/data/experiment?limit=50&offset=0';

const Experiments = () => {
  const [experiments, setExperiments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
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
    // Pass experiment ID and name in the URL query parameters
    navigate(`/runs?experimentId=${experimentId}&experimentName=${experimentName}`);
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
    </div>
  );
};

export default Experiments;
