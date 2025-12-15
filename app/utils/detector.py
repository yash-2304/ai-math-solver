import re

def detect_problem_type(expression: str) -> str:
    """
    Detects the math problem type from the expression.
    MUST return ONLY a string (FastAPI schema safe).
    Priority order matters.
    """

    expr = expression.lower().replace(" ", "")

    # ---------- Limits ----------
    if "lim" in expr:
        return "limits"

    # ---------- Calculus ----------
    # Derivatives
    if "d/dx" in expr or "derivative" in expr:
        return "calculus"

    # Integrals
    if "∫" in expr or "integral" in expr:
        return "calculus"

    # ---------- Trigonometry ----------
    if re.search(r"(sin|cos|tan|sec|csc|cot)", expr):
        return "trigonometry"

    # ---------- Algebra ----------
    # Equation or arithmetic expression
    if "=" in expr or re.search(r"[a-z]\d|\d[a-z]", expr):
        return "algebra"

    if any(op in expr for op in ["+", "-", "*", "/", "^"]):
        return "algebra"

    return "unknown"