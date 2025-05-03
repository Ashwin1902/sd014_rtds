from pydantic import BaseModel, Field, validator
from typing import Optional, List
from enum import Enum

class TaskType(str, Enum):
    TRAINING = "training"
    INFERENCE = "inference"

class WorkloadInput(BaseModel):
    model_type: str = Field(..., description="Type of ML model (e.g., BERT, ResNet, T5)")
    dataset_size_gb: float = Field(..., description="Size of the dataset in GB")
    task_type: TaskType = Field(TaskType.TRAINING, description="Whether the workload is training or inference")
    budget: Optional[float] = Field(None, description="Maximum hourly budget in USD")
    preferred_region: Optional[str] = Field(None, description="Preferred region for deployment")
    
    @validator('dataset_size_gb')
    def dataset_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Dataset size must be greater than 0 GB')
        return v
    
    @validator('budget')
    def budget_must_be_positive_if_provided(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Budget must be greater than 0 USD if provided')
        return v

class GPUInstance(BaseModel):
    resource_class: str
    vcpus: int
    ram: int
    price_per_hour: float
    price_per_month: float
    price_per_spot: Optional[float] = None
    gpu_description: str
    region: str
    country: str
    
    class Config:
        schema_extra = {
            "example": {
                "resource_class": "gpu-t4-small",
                "vcpus": 4,
                "ram": 16,
                "price_per_hour": 0.85,
                "price_per_month": 620.50,
                "price_per_spot": 0.26,
                "gpu_description": "NVIDIA Tesla T4 (16GB)",
                "region": "ap-south-mum-1",
                "country": "India"
            }
        }

class Recommendation(BaseModel):
    instance: GPUInstance
    explanation: str
    
    class Config:
        schema_extra = {
            "example": {
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
            }
        }