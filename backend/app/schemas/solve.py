from pydantic import BaseModel
from typing import List

class SolveRequest(BaseModel):
    expression: str

class SolveResponse(BaseModel):
    problem_type: str
    original_expression: str
    solution: str
    steps: List[str]
    latex: str