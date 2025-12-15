from fastapi import APIRouter
from app.schemas.solve import SolveRequest, SolveResponse
from app.utils.detector import detect_problem_type
from app.solver.algebra import solve_algebra
from app.solver.calculus import solve_calculus
from app.solver.limits import solve_limits

router = APIRouter(prefix="/solve", tags=["Solver"])


@router.post("", response_model=SolveResponse)
def solve_problem(request: SolveRequest):
    problem_type = detect_problem_type(request.expression)

    if problem_type == "algebra":
        return solve_algebra(request.expression)

    if problem_type in ["calculus", "trigonometry"]:
        return solve_calculus(request.expression)

    if problem_type == "limits":
        return solve_limits(request.expression)

    return {
        "problem_type": problem_type,
        "original_expression": request.expression,
        "solution": "Solver not implemented yet",
        "steps": [],
        "latex": ""
    }