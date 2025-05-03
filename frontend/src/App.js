import React, { useState, useEffect } from 'react';
import { getRecommendations, checkHealth, getRegions, getModelTypes } from './api';
import './App.css';

function App() {
  const [workload, setWorkload] = useState({
    model_type: '',
    dataset_size_gb: 1,
    task_type: 'training',
    budget: '',
    preferred_region: ''
  });
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  const [regions, setRegions] = useState([]);
  const [modelTypes] = useState(getModelTypes());

  // Check server health on mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const isHealthy = await checkHealth();
        setServerStatus(isHealthy ? 'online' : 'offline');
      } catch (err) {
        setServerStatus('offline');
      }
    };
    
    const fetchRegions = async () => {
      try {
        const regionData = await getRegions();
        setRegions(regionData);
      } catch (err) {
        console.error('Failed to fetch regions:', err);
      }
    };
    
    checkServerHealth();
    fetchRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkload({ ...workload, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await getRecommendations(workload);
      setRecommendations(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GPU Cost Optimizer & Recommender</h1>
        <div className={`server-status ${serverStatus}`}>
          Server: {serverStatus}
        </div>
      </header>
      
      <main className="main-content">
        <section className="form-section">
          <h2>Workload Requirements</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="model_type">Model Type</label>
              <select 
                id="model_type" 
                name="model_type" 
                value={workload.model_type}
                onChange={handleChange}
                required
              >
                <option value="">Select model type...</option>
                {modelTypes.map(model => (
                  <option key={model.value} value={model.value}>{model.label}</option>
                ))}
                <option value="custom">Custom (type below)</option>
              </select>
              {workload.model_type === 'custom' && (
                <input 
                  name="custom_model_type" 
                  placeholder="Enter custom model name"
                  onChange={(e) => setWorkload({...workload, model_type: e.target.value})}
                />
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="dataset_size_gb">Dataset Size (GB)</label>
              <input 
                id="dataset_size_gb"
                name="dataset_size_gb" 
                type="number" 
                min="0.1"
                step="0.1"
                value={workload.dataset_size_gb}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="task_type">Task Type</label>
              <select 
                id="task_type"
                name="task_type" 
                value={workload.task_type}
                onChange={handleChange}
              >
                <option value="training">Training</option>
                <option value="inference">Inference</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="budget">Budget (USD/hour)</label>
              <input 
                id="budget"
                name="budget" 
                type="number"
                min="0.1"
                step="0.1" 
                placeholder="Optional" 
                value={workload.budget}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="preferred_region">Preferred Region</label>
              <select 
                id="preferred_region"
                name="preferred_region" 
                value={workload.preferred_region}
                onChange={handleChange}
              >
                <option value="">Any Region</option>
                {regions.map(region => (
                  <option key={region.value} value={region.value}>{region.label}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="submit-button" disabled={loading || serverStatus === 'offline'}>
              {loading ? 'Finding optimal instances...' : 'Get Recommendations'}
            </button>
          </form>
        </section>
        
        {error && <div className="error-message">{error}</div>}
        
        {recommendations.length > 0 && (
          <section className="results-section">
            <h2>Recommended GPU Instances</h2>
            <div className="recommendations-grid">
              {recommendations.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="recommendation-header">
                    <h3>{rec.instance.resource_class}</h3>
                    <span className={`badge ${index === 0 ? 'best-match' : ''}`}>
                      {index === 0 ? 'Best Match' : `Option ${index + 1}`}
                    </span>
                  </div>
                  
                  <div className="instance-details">
                    <div className="detail-item">
                      <span className="detail-label">GPU:</span>
                      <span className="detail-value">{rec.instance.gpu_description}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">vCPUs:</span>
                      <span className="detail-value">{rec.instance.vcpus}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">RAM:</span>
                      <span className="detail-value">{rec.instance.ram} GB</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Region:</span>
                      <span className="detail-value">{rec.instance.region} ({rec.instance.country})</span>
                    </div>
                    
                    <div className="pricing-info">
                      <div className="price-item">
                        <span className="price-label">On-Demand:</span>
                        <span className="price-value">${rec.instance.price_per_hour.toFixed(2)}/hr</span>
                      </div>
                      
                      {rec.instance.price_per_spot && (
                        <div className="price-item spot">
                          <span className="price-label">Spot Price:</span>
                          <span className="price-value">${rec.instance.price_per_spot.toFixed(2)}/hr</span>
                          <span className="savings">
                            Save {Math.round((1 - rec.instance.price_per_spot / rec.instance.price_per_hour) * 100)}%
                          </span>
                        </div>
                      )}
                      
                      <div className="price-item">
                        <span className="price-label">Monthly:</span>
                        <span className="price-value">${rec.instance.price_per_month.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="match-explanation">
                    <h4>Match Summary</h4>
                    <p>{rec.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {recommendations.length === 0 && !loading && !error && (
          <div className="no-results">
            <p>No recommendations available yet. Please enter your workload details and submit.</p>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© 2025 GPU Cost Optimizer - A tool to help you find the most cost-effective GPU instances for your workloads</p>
      </footer>
    </div>
  );
}

export default App;