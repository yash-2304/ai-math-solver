import { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const highlightKeywords = (text) => {
  if (!text) return text;
  return text
    .replace(/differentiation|differentiate|derivative/gi, (m) => `**${m}**`)
    .replace(/solve|solving|solution/gi, (m) => `**${m}**`)
    .replace(/limit|limits/gi, (m) => `**${m}**`);
};

function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExplanation, setShowExplanation] = useState(true);
  const [showGraphs, setShowGraphs] = useState(true);

  const solveMath = async () => {
    if (!expression.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expression }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Backend not reachable. Is FastAPI running?");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .app-grid {
            grid-template-columns: 1fr !important;
          }
          .sidebar {
            border-right: none !important;
            border-bottom: 1px solid #2a2a2a;
          }
          .graphs-panel {
            display: block !important;
            border-left: none !important;
            border-top: 1px solid #2a2a2a;
            padding: 24px 16px !important;
          }
        }
        @media (max-width: 900px) {
          .explanation-panel {
            display: none;
          }
          .explanation-panel.show {
            display: block;
          }
        }
        @media (max-width: 900px) {
          .mobile-toggle {
            display: inline-block !important;
          }
        }
      `}</style>
      <div
        className="app-grid"
        style={{
          minHeight: "100vh",
          background: "#121212",
          color: "#f5f5f5",
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          gridTemplateColumns: showExplanation ? "420px 1fr 420px" : "420px 1fr",
          columnGap: "24px",
        }}
      >
        <div className="sidebar" style={{ padding: "40px", borderRight: "1px solid #2a2a2a" }}>
          <h1 style={{ marginBottom: "20px" }}>🧮 AI Math Solver</h1>
          <p style={{
            marginTop: "-10px",
            marginBottom: "20px",
            opacity: 0.7,
            fontSize: "14px",
            maxWidth: "360px",
            lineHeight: 1.5
          }}>
            Enter an equation, derivative, or limit. The solver will compute the answer
            and explain the reasoning step by step.
          </p>

          <input
            style={{
              width: "100%",
              maxWidth: "360px",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#1e1e1e",
              color: "#fff",
            }}
            placeholder="e.g. d/dx sin(3x)"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                solveMath();
              }
            }}
          />

          <br />
          <br />

          <button
            onClick={solveMath}
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "15px",
              borderRadius: "6px",
              border: "none",
              background: loading ? "#2a2a2a" : "#4f46e5",
              color: loading ? "#888" : "white",
              cursor: loading ? "not-allowed" : "pointer",
              width: "100%",
              maxWidth: "200px",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Solving…" : "Solve"}
          </button>
          <p style={{
            marginTop: "12px",
            fontSize: "13px",
            opacity: 0.6
          }}>
            Press Enter or click Solve to compute
          </p>

          <br />
          <br />

          {loading && (
            <p style={{ opacity: 0.7, fontSize: "14px" }}>
              ⏳ Solving… please wait
            </p>
          )}

          {error && (
            <div
              style={{
                background: "#2a1a1a",
                color: "#ffb4b4",
                padding: "12px",
                borderRadius: "6px",
                width: "fit-content",
              }}
            >
              {error}
            </div>
          )}

          {result && !error && (
            <div
              style={{
                marginTop: "20px",
                background: "#1e1e1e",
                padding: "20px",
                borderRadius: "8px",
                maxWidth: "600px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                📌 Type: {result.problem_type}
              </h3>

              <p>
                <strong>Expression:</strong> {result.original_expression}
              </p>

              <div style={{
                height: "1px",
                background: "linear-gradient(to right, #4f46e5, transparent)",
                margin: "14px 0",
                opacity: 0.6
              }} />

              <p>
                <strong>Solution:</strong>
              </p>
              <BlockMath math={result.solution} />

              {result.steps && result.steps.length > 0 && (
                <>
                  <strong>Steps:</strong>
                  <ol>
                    {result.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </>
              )}

              {result.latex && (
                <div style={{ marginTop: "12px", opacity: 0.9 }}>
                  <InlineMath math={result.latex} />
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className={`explanation-panel ${showExplanation ? "show" : ""}`}
          style={{
            padding: "40px 24px",
            color: "#bdbdbd",
            overflowY: "auto",
            maxHeight: "100vh",
          }}
        >
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ width: "100%" }}>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                style={{
                  display: "none",
                  marginBottom: "12px",
                  padding: "6px 12px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  border: "1px solid #333",
                  background: "#1f1f1f",
                  color: "#e5e5e5",
                  cursor: "pointer"
                }}
                className="mobile-toggle"
              >
                {showExplanation ? "Hide explanation" : "Show explanation"}
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <h2 style={{ margin: 0 }}>🧠 Explanation Panel</h2>
                <span style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  borderRadius: "999px",
                  background: "#1f1f1f",
                  border: "1px solid #2a2a2a",
                  opacity: 0.7
                }}>
                  Beta
                </span>
              </div>

              <div style={{
                height: "1px",
                background: "linear-gradient(to right, #4f46e5, transparent)",
                marginBottom: "16px",
                opacity: 0.6
              }} />

              {!result && !loading && (
                <>
                  <p style={{ opacity: 0.75, lineHeight: 1.6 }}>
                    This panel explains the <strong>reasoning</strong> behind the solution.
                    Once you solve a problem, you’ll see how the answer was derived step by step.
                  </p>

                  <div style={{
                    marginTop: "14px",
                    padding: "12px 14px",
                    background: "#181818",
                    borderRadius: "8px",
                    border: "1px dashed #2a2a2a",
                    fontSize: "14px"
                  }}>
                    ✨ Try examples like:
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
                      {[
                        "d/dx sin(3x)",
                        "2x + 3 = 7",
                        "limit x→0 sin(x)/x",
                      ].map((example) => (
                        <button
                          key={example}
                          onClick={() => setExpression(example)}
                          style={{
                            padding: "6px 10px",
                            fontSize: "13px",
                            borderRadius: "999px",
                            border: "1px solid #333",
                            background: "#202020",
                            color: "#e5e5e5",
                            cursor: "pointer",
                          }}
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {loading && (
                <div style={{
                  padding: "24px",
                  background: "#181818",
                  borderRadius: "10px",
                  border: "1px solid #2a2a2a",
                  opacity: 0.8
                }}>
                  <p style={{ fontSize: "16px" }}>⏳ Working on the solution…</p>
                  <p style={{ fontSize: "14px", opacity: 0.7 }}>
                    The system is analyzing the expression and preparing a step-by-step explanation.
                  </p>
                </div>
              )}

              {result && (
                <div style={{
                  background: "#181818",
                  border: "1px solid #2a2a2a",
                  borderRadius: "10px",
                  padding: "24px"
                }}>
                  <div style={{ lineHeight: 1.7 }}>
                    <p>
                      <strong>Detected problem type:</strong> {result.problem_type}
                    </p>

                    <p>
                      <strong>What is happening?</strong>
                      <br />
                      {result.problem_type === "calculus" &&
                        "This problem involves differentiation. We analyze the structure of the function and apply differentiation rules step by step."}
                      {result.problem_type === "algebra" &&
                        "This problem involves solving an equation. We isolate the variable using algebraic rules."}
                      {result.problem_type === "limits" &&
                        "This problem involves evaluating a limit by simplifying the expression as the variable approaches a value."}
                    </p>

                    {result.steps && result.steps.length > 0 && (
                      <>
                        <p><strong>Detailed reasoning:</strong></p>
                        {result.steps.map((step, idx) => (
                          <div
                            key={idx}
                            style={{
                              marginBottom: "14px",
                              padding: "14px 16px",
                              background: "#202020",
                              borderRadius: "8px",
                              borderLeft: "4px solid #4f46e5",
                              display: "flex",
                              gap: "12px",
                              alignItems: "flex-start"
                            }}
                          >
                            <div
                              style={{
                                minWidth: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "#4f46e5",
                                color: "white",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600
                              }}
                            >
                              {idx + 1}
                            </div>
                            <div style={{ lineHeight: 1.6 }}>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: highlightKeywords(step).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    <div style={{
                      marginTop: "20px",
                      padding: "16px",
                      border: "1px dashed #333",
                      borderRadius: "8px",
                      opacity: 0.6
                    }}>
                      📈 Visualizations & interactive graphs coming soon
                    </div>

                    <p style={{ opacity: 0.7, marginTop: "16px" }}>
                      This panel will later support interactive explanations, visualizations,
                      and AI-generated tutoring.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {showGraphs && (
          <div
            className="graphs-panel"
            style={{
              padding: "40px 24px",
              borderLeft: "1px solid #2a2a2a",
              color: "#bdbdbd",
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "100%",
                background: "#181818",
                border: "1px solid #2a2a2a",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>📊 Graphs</h3>

              {result ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={
                      Array.from({ length: 400 }, (_, i) => {
                        const x = -4 + (8 * i) / 399;

                        // ALGEBRA: y = LHS - RHS (root at y = 0)
                        if (result.problem_type === "algebra") {
                          return { x, y: 2 * x + 3 - 7 };
                        }

                        // CALCULUS: accurate plotting
                        if (result.problem_type === "calculus") {
                          const expr = result.original_expression.replace(/\s+/g, "").toLowerCase();

                        // y = sin(3x), dy = 3cos(3x)
                        if (expr.includes("sin(3x)")) {
                          return {
                            x,
                            y: Math.sin(3 * x),
                            dy: 3 * Math.cos(3 * x),
                          };
                        }

                        // y = cos(3x), dy = -3sin(3x)
                        if (expr.includes("cos(3x)")) {
                          return {
                            x,
                            y: Math.cos(3 * x),
                            dy: -3 * Math.sin(3 * x),
                          };
                        }

                          // y = cot(x^3), dy = -3x^2 csc^2(x^3)
                          if (expr.includes("cot")) {
                            const u = x ** 3;
                            const sinU = Math.sin(u);

                            if (Math.abs(sinU) < 0.05) return { x, y: null, dy: null };

                            const y = Math.cos(u) / sinU;
                            const dy = -3 * x * x * (1 / (sinU * sinU));
                            return { x, y, dy };
                          }

                          // Unsupported calculus → hide graph
                          return { x, y: null, dy: null };
                        }

                        // LIMITS: sin(x)/x with hole at x = 0
                        if (result.problem_type === "limits") {
                          if (Math.abs(x) < 0.01) return { x, y: null };
                          return { x, y: Math.sin(x) / x };
                        }

                        return { x, y: null };
                      })
                    }
                  >
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis dataKey="x" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    {/* Original function */}
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#22c55e"
                      dot={false}
                      isAnimationActive={false}
                    />

                    {/* Derivative (only for calculus) */}
                    {result.problem_type === "calculus" && (
                      <Line
                        type="monotone"
                        dataKey="dy"
                        stroke="#60a5fa"
                        dot={false}
                        isAnimationActive={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ fontSize: "14px", opacity: 0.6, lineHeight: 1.6 }}>
                  Solve an expression to see graphs.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;