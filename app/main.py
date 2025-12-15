from fastapi import FastAPI
from app.routes.solve import router as solve_router

app = FastAPI(
    title="AI Math Solver",
    description="Solve math problems with step-by-step explanations",
    version="1.0.0"
)

app.include_router(solve_router)

@app.get("/")
def health_check():
    return {"status": "running"}