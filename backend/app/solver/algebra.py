from sympy import symbols, Eq, solve
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor
)

# Define supported symbols (extend later if needed)
x, y, z = symbols("x y z")

# Allow implicit multiplication: 2x, 3xy, 4(x+1)
TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
    convert_xor,
)

def solve_algebra(expression: str):
    expr = expression.replace(" ", "")

    if "=" not in expr:
        return {
            "problem_type": "algebra",
            "original_expression": expression,
            "solution": "Invalid equation. Please include '='.",
            "steps": [],
            "latex": ""
        }

    left, right = expr.split("=", 1)

    try:
        left_expr = parse_expr(
            left,
            transformations=TRANSFORMATIONS,
            local_dict={"x": x, "y": y, "z": z}
        )
        right_expr = parse_expr(
            right,
            transformations=TRANSFORMATIONS,
            local_dict={"x": x, "y": y, "z": z}
        )

        equation = Eq(left_expr, right_expr)

        # Solve for all symbols found in the equation
        symbols_in_eq = list(equation.free_symbols)
        solutions = solve(equation, symbols_in_eq, dict=True)

        # Format solutions nicely
        if solutions:
            formatted = []
            for sol in solutions:
                formatted.append(
                    ", ".join([f"{str(k)} = {str(v)}" for k, v in sol.items()])
                )
            solution_text = "; ".join(formatted)
        else:
            solution_text = "No solution found"

        return {
            "problem_type": "algebra",
            "original_expression": expression,
            "solution": solution_text,
            "steps": [
                f"Given equation: {expression}",
                "Apply implicit multiplication (e.g., 2x → 2·x)",
                "Rearrange terms to isolate the variable(s)",
                f"Solve the equation for {', '.join([str(s) for s in symbols_in_eq])}"
            ],
            "latex": str(equation)
        }

    except Exception as e:
        return {
            "problem_type": "algebra",
            "original_expression": expression,
            "solution": f"Could not solve the equation: {str(e)}",
            "steps": [],
            "latex": ""
        }