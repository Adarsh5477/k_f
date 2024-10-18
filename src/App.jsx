import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, AlertCircle } from 'lucide-react';
import './App.css';

const FlagDisplay = ({ flag, value }) => {
  const colorClass = value === 1 ? "flag-green" :
                    value === 2 ? "flag-amber" :
                    "flag-red";
  return (
    <div className={`flag ${colorClass}`}>
      {flag}: {value === 1 ? "Green" : value === 2 ? "Amber" : "Red"}
    </div>
  );
};

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to analyze.");
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const response = await axios.post('http://localhost:5000/api/analyze', { data: data.data });
        setResult(response.data);
      } catch (error) {
        console.error('Error:', error);
        setError("An error occurred while analyzing the file. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container">
      <div className="analysis-card">
        <div className="card-content">
          <div className="title">Financial Analysis Tool</div>
          <h1>Analyze Your Financial Data</h1>
          <p className="description">Upload a JSON file to get started with your financial analysis.</p>
          
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="file-upload-area">
              <div className="upload-content">
                <UploadCloud className="upload-icon" />
                <div className="upload-text">
                  <label htmlFor="file-upload" className="file-input-label">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} accept=".json" />
                  </label>
                  {/* <p>or drag and drop</p> */}
                </div>
                <p className="file-type">JSON up to 10MB</p>
              </div>
            </div>
            {file && <p className="selected-file">Selected file: {file.name}</p>}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {error && (
            <div className="alert error">
              <AlertCircle className="alert-icon" />
              <div className="alert-content">
                <h4>Error</h4>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="results-container">
              <h2>Analysis Results</h2>
              <div className="flags-container">
                {Object.entries(result.flags).map(([flag, value]) => (
                  <FlagDisplay key={flag} flag={flag} value={value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}