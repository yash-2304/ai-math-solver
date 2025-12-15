# 🧠 AI Math Solver

An AI-powered math problem solver capable of handling **algebra, calculus, and limits**, built using **FastAPI + SymPy**, with a modular architecture designed for future ML-based extensions.

---

## 🚀 Features

### ✅ Algebra
- Solve linear equations (e.g. `2x + 3 = 7`)
- Supports implicit multiplication (`2x`, `3(x+1)`)
- Returns step-by-step explanations

### ✅ Calculus
- Derivatives  
  - `d/dx(sin(3x))`
  - Chain rule handling
- Integrals  
  - `integrate x^2 dx`
- Implicit differentiation  
  - `x^2 + y^2 = 1`
- Limits  
  - `lim x->0 sin(x)/x`

### ✅ Smart Detection
- Automatically detects problem type using rule-based logic
- Designed to plug in ML classifiers later

---

## 🏗️ Tech Stack

**Backend**
- Python 3.13
- FastAPI
- SymPy
- Uvicorn

**Planned**
- ML-based problem classification
- React frontend
- LaTeX rendering
- Step-by-step visual solver

---

## 📂 Project Structure
ai-math-solver/
│
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── routes/
│   │   └── solve.py         # /solve endpoint
│   ├── solver/
│   │   ├── algebra.py
│   │   ├── calculus.py
│   │   └── limits.py
│   ├── utils/
│   │   └── detector.py      # Problem-type detection
│   └── schemas/
│       └── solve.py         # Request/Response models
│
├── requirements.txt
└── README.md


---

## 🔌 API Usage

### Endpoint

POST /solve
### Request
```json
{
  "expression": "d/dx(sin(3x))"
}

### Response
{
  "problem_type": "calculus",
  "original_expression": "d/dx(sin(3x))",
  "solution": "3*cos(3*x)",
  "steps": [
    "Identify inner and outer functions",
    "Apply the chain rule",
    "Differentiate and simplify"
  ],
  "latex": "3 \\cos(3 x)"
}

### Run Locally 
# create virtual environment
python -m venv venv
source venv/bin/activate

# install dependencies
pip install -r requirements.txt

# run server
uvicorn app.main:app --reload

2x + 3 = 7
integrate x^2 dx
d/dx(sin(3x))
lim x->0 sin(x)/x
x^2 + y^2 = 1


🧠 Future Roadmap
	•	🔄 ML-based classifier (Naive Bayes / Transformer)
	•	🖥️ React frontend with MathJax
	•	🧮 Multi-variable calculus
	•	📊 Step-by-step visual explanations
	•	🌐 Deployment (Render / AWS)


  👨‍💻 Author

Yash Prajapati
GitHub: https://github.com/yash-2304



