from sympy import symbols, integrate, diff, sympify, latex, sin, cos, tan, limit, Eq, solve
import re
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
)


x, y = symbols("x y")
TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
)

def solve_calculus(expression: str):
    """
    Handles:
    - Integrals: integrate x^2 dx
    - Derivatives: d/dx(sin(3x))
    - Implicit differentiation: x^2 + y^2 = 1
    - Limits: lim x->0 sin(x)/x
    """

    expr = expression.replace("^", "**").lower().strip()

    # ---------- LIMITS ----------
    if expr.startswith("lim"):
        match = re.match(r"lim\s+(\w+)->([-\d\.]+)\s+(.*)", expr)
        if match:
            var, point, func = match.groups()
            sym_var = symbols(var)
            sym_func = sympify(func)
            result = limit(sym_func, sym_var, float(point))

            return {
                "problem_type": "calculus",
                "original_expression": expression,
                "solution": str(result),
                "steps": [
                    f"Take the limit as {var} approaches {point}",
                    "Evaluate the expression",
                    "Simplify the result"
                ],
                "latex": latex(result)
            }

    # ---------- DERIVATIVES ----------
    if expr.startswith("d/dx") or "derivative" in expr:
        clean_expr = (
            expr.replace("d/dx", "")
            .replace("derivative of", "")
            .strip()
        )

        if clean_expr.startswith("(") and clean_expr.endswith(")"):
            clean_expr = clean_expr[1:-1]

        patterns = [
            (r"sin\((\d+)x\)", r"sin(\1*x)"),
            (r"cos\((\d+)x\)", r"cos(\1*x)"),
            (r"tan\((\d+)x\)", r"tan(\1*x)"),
            (r"sin(\d+)x", r"sin(\1*x)"),
            (r"cos(\d+)x", r"cos(\1*x)"),
            (r"tan(\d+)x", r"tan(\1*x)")
        ]

        for p, rpl in patterns:
            clean_expr = re.sub(p, rpl, clean_expr)

        sym_expr = parse_expr(clean_expr, transformations=TRANSFORMATIONS)
        result = diff(sym_expr, x)

        return {
            "problem_type": "calculus",
            "original_expression": expression,
            "solution": str(result),
            "steps": [
                "Identify inner and outer functions",
                "Apply the chain rule",
                "Differentiate and simplify"
            ],
            "latex": latex(result)
        }

    # ---------- IMPLICIT DIFFERENTIATION ----------
    if "=" in expr:
        left, right = expr.split("=")
        left_expr = parse_expr(left, transformations=TRANSFORMATIONS)
        right_expr = parse_expr(right, transformations=TRANSFORMATIONS)

        dydx = solve(
            Eq(
                diff(left_expr, x) + diff(left_expr, y) * diff(y, x),
                diff(right_expr, x) + diff(right_expr, y) * diff(y, x)
            ),
            diff(y, x)
        )[0]

        return {
            "problem_type": "calculus",
            "original_expression": expression,
            "solution": str(dydx),
            "steps": [
                "Differentiate both sides with respect to x",
                "Treat y as a function of x",
                "Solve for dy/dx"
            ],
            "latex": latex(dydx)
        }

    # ---------- INTEGRALS ----------
    if "integrate" in expr or expr.endswith("dx"):
        clean_expr = (
            expr.replace("integrate", "")
            .replace("dx", "")
            .strip()
        )

        sym_expr = parse_expr(clean_expr, transformations=TRANSFORMATIONS)
        result = integrate(sym_expr, x)

        return {
            "problem_type": "calculus",
            "original_expression": expression,
            "solution": str(result),
            "steps": [
                "Identify the integrand",
                "Apply integration rules",
                "Add the constant of integration"
            ],
            "latex": latex(result)
        }

    return {
        "problem_type": "calculus",
        "original_expression": expression,
        "solution": "Unsupported calculus expression",
        "steps": [],
        "latex": ""
    }