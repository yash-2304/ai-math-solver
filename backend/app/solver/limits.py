import sympy as sp
from sympy.parsing.sympy_parser import parse_expr
import numpy as np

x = sp.symbols("x")

def generate_graph_data(expr, var, start=-5, end=5, num=400):
    xs = np.linspace(start, end, num)
    ys = []

    f = sp.lambdify(var, expr, modules=["numpy"])

    for val in xs:
        try:
            y = f(val)
            if y is None or np.isnan(y) or np.isinf(y):
                ys.append(None)
            else:
                ys.append(float(y))
        except Exception:
            ys.append(None)

    series = []
    for x_val, y_val in zip(xs, ys):
        if y_val is not None:
            series.append({
                "x": float(x_val),
                "y": float(y_val)
            })

    return {
        "series": series
    }


def solve_limits(expression: str):
    try:
        # Normalize arrows and spacing
        cleaned = (
            expression
            .lower()
            .replace("→", "->")
            .replace("to", "->")
            .replace("limit", "")
            .strip()
        )

        # Expect something like: x->0 sin(x)/x
        if "->" not in cleaned:
            raise ValueError("Invalid limit format. Use: limit x->a f(x)")

        left, right = cleaned.split("->", 1)

        # variable (usually x)
        var_name = left.strip()
        var = sp.symbols(var_name)

        # split point and expression
        import re
        m = re.match(r"\s*([-+]?\d*\.?\d+)\s*(.*)", right.strip())
        if not m:
            raise ValueError("Could not parse limit value.")

        limit_at = float(m.group(1))
        expr_str = m.group(2)

        # Parse expression safely
        expr = parse_expr(
            expr_str,
            local_dict={
                var_name: var,
                "sin": sp.sin,
                "cos": sp.cos,
                "tan": sp.tan,
                "exp": sp.exp,
                "log": sp.log
            },
            evaluate=True
        )

        # Compute limit
        result = sp.limit(expr, var, limit_at)

        # Always generate graph data for the function
        graph = generate_graph_data(expr, var, start=-5, end=5)

        return {
            "problem_type": "limits",
            "original_expression": expression,
            "solution": str(result),
            "steps": [
                "Identify the limit expression",
                f"Evaluate behavior as {var} → {limit_at}",
                "Apply known limit rules"
            ],
            "latex": sp.latex(result),
            "graph": graph
        }

    except Exception as e:
        # IMPORTANT: still return graph key so frontend can render
        return {
            "problem_type": "limits",
            "original_expression": expression,
            "solution": "Error",
            "steps": [str(e)],
            "latex": "",
            "graph": {
                "series": []
            }
        }