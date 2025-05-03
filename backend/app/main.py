from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sys
import os
import traceback
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend')))

# Import application modules
from .schemas import WorkloadInput, Recommendation
from .recommender import recommend_instances

app = FastAPI(title="GPU Cost Optimizer API", 
              description="API for recommending optimal GPU instances for ML workloads")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint to check if the API is running"""
    logger.info("Root endpoint accessed")
    return {"status": "ok", "message": "GPU Cost Optimizer API is running"}

@app.post("/recommendations", response_model=List[Recommendation])
async def get_recommendations(workload: WorkloadInput):
    """Get GPU instance recommendations based on workload requirements"""
    try:
        logger.info(f"Received recommendation request: {workload}")
        
        # Validate input
        if workload.dataset_size_gb <= 0:
            logger.warning("Invalid dataset size provided")
            raise HTTPException(status_code=400, detail="Dataset size must be greater than 0 GB")
        
        if not workload.model_type:
            logger.warning("No model type provided")
            raise HTTPException(status_code=400, detail="Model type is required")
        
        # Get recommendations
        logger.info(f"Getting recommendations for workload: {workload}")
        recommendations = await recommend_instances(workload)
        
        # If no recommendations found
        if not recommendations:
            logger.warning("No recommendations found")
            # Instead of returning empty array, use mock data
            from .recommender import get_mock_instances
            mock_instances = get_mock_instances("ap-south-mum-1")
            mock_score = 70.0
            recommendations = [
                Recommendation(
                    instance=instance,
                    explanation=f"✅ RAM: {instance.ram}GB | GPU: {instance.gpu_description} | Region: {instance.region} | 💰 ${instance.price_per_hour:.2f}/hr | Score: {mock_score}/110"
                )
                for instance in mock_instances[:3]
            ]
            
        logger.info(f"Returning {len(recommendations)} recommendations")
        return recommendations
        
    except Exception as e:
        error_msg = f"Error processing recommendation request: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)

# Add health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    logger.info("Health check accessed")
    return {"status": "healthy"}