from sympy import symbols, limit, sympify, latex

x = symbols("x")

def solve_limits(expression: str):
    try:
        # normalize input
        expr = expression.replace("lim", "").strip()
        expr = expr.replace("x->0", "").replace("→", "")
        
        sym_expr = sympify(expr)
        result = limit(sym_expr, x, 0)

        return {
            "problem_type": "limits",
            "original_expression": expression,
            "solution": str(result),
            "steps": [
                "Identify the limit expression",
                "Apply standard limit rules",
                "Evaluate the limit"
            ],
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