import axios from 'axios';

// Use environment variable or default to localhost in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Get GPU recommendations based on workload parameters
 * @param {Object} workload - The workload parameters
 * @returns {Promise<Array>} - Array of recommendations
 */
export const getRecommendations = async (workload) => {
  try {
    // Convert numeric fields from string to numbers
    const formattedWorkload = {
      ...workload,
      dataset_size_gb: parseFloat(workload.dataset_size_gb) || 0,
      budget: workload.budget ? parseFloat(workload.budget) : null
    };
    
    const response = await axios.post(`${API_URL}/recommendations`, formattedWorkload);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    
    // Return more detailed error info
    const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
    throw new Error(`Failed to fetch recommendations: ${errorMessage}`);
  }
};

/**
 * Check if API server is healthy
 * @returns {Promise<boolean>} - True if healthy
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

/**
 * Get available regions for GPU instances
 * @returns {Promise<Array>} - Array of regions
 */
export const getRegions = async () => {
  // This is a placeholder. In a real application, you might have an endpoint for this.
  return [
    { value: 'ap-south-mum-1', label: 'Mumbai, India' },
    { value: 'ap-south-noi-1', label: 'Noida, India' },
    { value: 'us-east-at-1', label: 'Atlanta, USA' }
  ];
};

/**
 * Get suggested model types
 * @returns {Array} - Array of common GPU model types
 */
export const getModelTypes = () => {
  return [
    { value: 'bert', label: 'BERT' },
    { value: 't5', label: 'T5' },
    { value: 'resnet', label: 'ResNet' },
    { value: 'gpt', label: 'GPT' },
    { value: 'vgg', label: 'VGG' },
    { value: 'a100', label: 'Models optimized for A100' },
    { value: 't4', label: 'Models optimized for T4' },
    { value: 'v100', label: 'Models optimized for V100' }
  ];
};