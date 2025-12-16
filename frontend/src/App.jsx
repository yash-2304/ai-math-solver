import { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

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
          gridTemplateColumns: "420px minmax(0, 1fr)",
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
          style={{
            padding: "40px",
            color: "#bdbdbd",
            overflowY: "auto",
            maxHeight: "100vh",
          }}
        >
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
      Once you solve a problem, you’ll see how the answer was derived — step by step.
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
    maxWidth: "720px",
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
              padding: "24px",
              maxWidth: "720px"
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
    </>
  );
}

export default App;