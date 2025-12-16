from sympy import symbols, limit, latex
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application
)

x = symbols("x")

TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
)

def solve_limits(expression: str):
    try:
        # Normalize input
        raw = expression.strip()
        expr = raw.lower().replace("limit", "").replace("lim", "").strip()

        # Normalize arrows
        expr = expr.replace("→", "->")

        approach_value = 0

        # Handle syntax like: x->0 sin(x)/x
        if "->" in expr:
            before, after = expr.split("->", 1)
            parts = after.strip().split(" ", 1)
            approach_value = parse_expr(parts[0], transformations=TRANSFORMATIONS)
            expr = parts[1] if len(parts) > 1 else before.strip()

        expr = expr.replace(" ", "")

        sym_expr = parse_expr(
            expr,
            transformations=TRANSFORMATIONS,
            evaluate=True
        )

        # --- Step generation (smart, non-destructive) ---
        steps = ["Identify the limit expression"]

        # Recognize common limits
        try:
            from sympy import sin, cos
            if sym_expr == sin(x)/x and approach_value == 0:
                steps.extend([
                    "Recognize the standard limit sin(x)/x as x → 0",
                    "Apply the known result: lim x→0 sin(x)/x = 1"
                ])
            elif sym_expr == (1 - cos(x))/x**2 and approach_value == 0:
                steps.extend([
                    "Recognize the standard limit (1 − cos(x))/x² as x → 0",
                    "Apply the known result: lim x→0 (1 − cos(x))/x² = 1/2"
                ])
            else:
                steps.append("Substitute the approaching value and simplify")
        except Exception:
            steps.append("Substitute the approaching value and simplify")

        result = limit(sym_expr, x, approach_value)

        steps.append("Conclude the limit value")

        return {
            "problem_type": "limits",
            "original_expression": raw,
            "solution": str(result),
            "steps": steps,
            "latex": latex(result)
        }

    except Exception as e:
        return {
            "problem_type": "limits",
            "original_expression": expression,
            "solution": f"Error: {str(e)}",
            "steps": [],
            "latex": ""
        }