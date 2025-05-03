# GPU Cost Optimizer & Recommender

![GPU Cost Optimizer Banner](https://via.placeholder.com/1200x300/4a6cf7/ffffff?text=GPU+Cost+Optimizer)

A full-stack application that helps users find the most cost-effective GPU instances for their specific machine learning workloads across various cloud providers and regions.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🔭 Overview

The GPU Cost Optimizer is designed to help data scientists, ML engineers, and researchers find the most cost-effective GPU instances across various cloud providers based on their specific workload requirements. By analyzing factors such as model type, dataset size, task type (training or inference), budget constraints, and preferred regions, the application recommends optimal GPU instances with detailed explanations of why each instance is recommended.

## ✨ Features

- **Intelligent Recommendations**: Recommends GPU instances based on comprehensive scoring that considers multiple factors.
- **Multi-Region Support**: Searches for GPU instances across multiple regions (Mumbai, Noida, Atlanta).
- **Task-Aware Optimization**: Optimizes recommendations differently for training vs. inference tasks.
- **Budget Constraints**: Takes into account budget limitations when making recommendations.
- **Spot Instance Savings**: Highlights potential savings from using spot instances.
- **Detailed Explanations**: Provides clear explanations for why each instance is recommended.
- **Server Health Monitoring**: Shows the status of the backend API.
- **Responsive UI**: Works well on both desktop and mobile devices.

## 🏗 Architecture

The application follows a modern client-server architecture:

```
GPU Cost Optimizer
├── Backend (FastAPI)
│   ├── app/
│   │   ├── main.py         # API endpoints
│   │   ├── recommender.py  # Recommendation logic
│   │   └── schemas.py      # Data models/schemas
│   └── requirements.txt    # Python dependencies
└── Frontend (React)
    ├── public/
    ├── src/
    │   ├── App.js          # Main React component
    │   ├── App.css         # Styles
    │   └── api.js          # API client functions
    └── package.json        # JS dependencies
```

## 🛠 Technologies Used

### Backend
- **FastAPI**: High-performance API framework with automatic validation
- **Pydantic**: Data validation and settings management
- **AIOHTTP**: Asynchronous HTTP client for API requests
- **Python 3.8+**: Modern Python runtime

### Frontend
- **React**: Frontend UI library
- **Axios**: HTTP client for API requests
- **CSS3**: Custom styling with modern CSS features

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+**
- **Node.js 14+** and **npm 6+**
- **Git**

## 🚀 Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/yourusername/gpu-cost-optimizer.git
cd gpu-cost-optimizer
```

### Backend Setup

1. Create and activate a virtual environment:

```bash
# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

2. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

3. Start the FastAPI server:

```bash
# From the backend directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`.  
You can access the Swagger documentation at `http://localhost:8000/docs`.

### Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm start
```

The frontend application will be available at `http://localhost:3000`.

### Environment Variables

#### Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Environment (development, production)
ENVIRONMENT=development

# Enable/disable debugging
DEBUG=True

# API Keys for external services (if needed)
ACECLOUD_API_KEY=your_acecloud_api_key_here

# Allowed origins for CORS
ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend Environment Variables

Create a `.env` file in the frontend directory with:

```
# API URL
REACT_APP_API_URL=http://localhost:8000

# Environment
REACT_APP_ENV=development
```

## 📚 API Documentation

The backend provides the following API endpoints:

### `GET /`

Root endpoint to check if the API is running.

**Response**:
```json
{
  "status": "ok",
  "message": "GPU Cost Optimizer API is running"
}
```

### `GET /health`

Health check endpoint.

**Response**:
```json
{
  "status": "healthy"
}
```

### `POST /recommendations`

Get GPU instance recommendations based on workload requirements.

**Request Body**:
```json
{
  "model_type": "bert",
  "dataset_size_gb": 10.5,
  "task_type": "training",
  "budget": 2.5,
  "preferred_region": "ap-south-mum-1"
}
```

**Response**:
```json
[
  {
    "instance": {
      "resource_class": "gpu-t4-small",
      "vcpus": 4,
      "ram": 16,
      "price_per_hour": 0.85,
      "price_per_month": 620.50,
      "price_per_spot": 0.26,
      "gpu_description": "NVIDIA Tesla T4 (16GB)",
      "region": "ap-south-mum-1",
      "country": "India"
    },
    "explanation": "✅ RAM: 16GB (needed: 10GB) | GPU Match: ✅ Excellent | Region: ✅ Matching (ap-south-mum-1) | 💰 $0.85/hr ✅ Under budget | 🔄 Spot available at $0.26/hr (69% savings) | Score: 92/110"
  },
  // Additional recommendations...
]
```

## 📖 Usage Guide

1. **Open the Application**: Navigate to the application URL (localhost:3000 during development).

2. **Enter Workload Requirements**:
   - **Model Type**: Select your ML model type from the dropdown or enter a custom model name
   - **Dataset Size**: Enter the size of your dataset in GB
   - **Task Type**: Select whether you're running training or inference
   - **Budget**: (Optional) Enter your maximum hourly budget in USD
   - **Preferred Region**: (Optional) Select your preferred region for deployment

3. **Get Recommendations**: Click the "Get Recommendations" button.

4. **Review Recommendations**: The application will display a list of recommended GPU instances, with the best match highlighted. Each recommendation includes:
   - GPU type and specifications
   - Region and country
   - Pricing information (on-demand, spot, and monthly)
   - A detailed explanation of why this instance is recommended

5. **Consider Spot Pricing**: Look for significant savings through spot pricing options.

## 💻 Development

### Backend Development

The backend is built with FastAPI and follows these conventions:

- **app/main.py**: Contains API endpoints and request handling
- **app/recommender.py**: Contains the core recommendation logic and scoring algorithm
- **app/schemas.py**: Contains Pydantic models for data validation

To add new functionality:

1. Define new schemas in `schemas.py` if needed
2. Implement the business logic in `recommender.py`
3. Create new API endpoints in `main.py`

### Frontend Development

The frontend is a React application with the following structure:

- **src/App.js**: Main React component
- **src/api.js**: API client functions
- **src/App.css**: Custom styles

To extend the frontend:

1. Add new components in the `src` directory
2. Update API client functions in `api.js` if needed
3. Add new styles in `App.css`

## 🧪 Testing

### Backend Testing

Run backend tests using pytest:

```bash
# From the backend directory
pytest
```

### Frontend Testing

Run frontend tests using Jest:

```bash
# From the frontend directory
npm test
```

## 🚢 Deployment

### Backend Deployment

The backend can be deployed as a Docker container or directly to a cloud provider:

#### Docker Deployment

```bash
# Build the Docker image
docker build -t gpu-cost-optimizer-api ./backend

# Run the container
docker run -p 8000:8000 gpu-cost-optimizer-api
```

#### Direct Deployment

For deploying to platforms like Heroku, AWS Elastic Beanstalk, or Google Cloud Run, follow the specific platform's instructions for deploying FastAPI applications.

### Frontend Deployment

Build the frontend for production:

```bash
# From the frontend directory
npm run build
```

This creates a `build` directory with static assets that can be served by any web server or static hosting service like Netlify, Vercel, or AWS S3.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Acknowledgements

- [ACE Cloud Hosting](https://acecloudhosting.com) for providing GPU pricing data
- All contributors who have helped shape this project

---

*For questions or support, please open an issue on the GitHub repository.*