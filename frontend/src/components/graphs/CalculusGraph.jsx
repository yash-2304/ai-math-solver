import React from "react";

/**
 * CalculusGraph
 * Renders the original function and its derivative using SVG.
 * Expects props:
 *  - func: (x:number) => number
 *  - derivative: (x:number) => number
 */
export default function CalculusGraph({ func, derivative }) {
  const width = 420;
  const height = 260;
  const padding = 40;

  const xMin = -5;
  const xMax = 5;
  const yMin = -5;
  const yMax = 5;

  const scaleX = (x) =>
    padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const scaleY = (y) =>
    height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);

  const generatePath = (fn) => {
    let d = "";
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = fn(x);
      if (Number.isFinite(y)) {
        d += `${i === 0 ? "M" : "L"} ${scaleX(x)} ${scaleY(y)} `;
      }
    }
    return d;
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ marginBottom: "8px" }}>📈 Function Graph</h3>

      <svg width={width} height={height} style={{ background: "#0f0f0f", borderRadius: "8px" }}>
        {/* Axes */}
        <line
          x1={scaleX(0)}
          y1={padding}
          x2={scaleX(0)}
          y2={height - padding}
          stroke="#444"
        />
        <line
          x1={padding}
          y1={scaleY(0)}
          x2={width - padding}
          y2={scaleY(0)}
          stroke="#444"
        />

        {/* Original function */}
        <path
          d={generatePath(func)}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
        />

        {/* Derivative */}
        <path
          d={generatePath(derivative)}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2"
        />
      </svg>

      <div style={{ marginTop: "8px", fontSize: "13px", color: "#aaa" }}>
        <div>🔵 f(x)</div>
        <div>🟣 f'(x)</div>
      </div>
    </div>
  );
}
