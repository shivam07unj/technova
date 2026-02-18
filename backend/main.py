from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from routes import router

# Create FastAPI app
app = FastAPI(
    title="AI-Powered Cross-Sell Banking System",
    description="Production-ready FastAPI backend for AI-powered banking cross-sell recommendations",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Powered Cross-Sell Banking System API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


