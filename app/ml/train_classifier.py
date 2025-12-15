import joblib
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# --------------------------------------------------
# Expanded training data for better accuracy
# --------------------------------------------------
data = [
    # ALGEBRA
    ("2*x + 3 = 7", "algebra"),
    ("x^2 + 5*x + 6 = 0", "algebra"),
    ("solve x + 10 = 0", "algebra"),
    ("3x = 9", "algebra"),
    ("x^2 + y^2 = 1", "algebra"),
    ("x + y = 5", "algebra"),
    ("solve for x", "algebra"),

    # CALCULUS – DERIVATIVES
    ("d/dx x^2", "calculus"),
    ("d/dx sin(x)", "calculus"),
    ("differentiate x^3", "calculus"),
    ("derivative of cos(x)", "calculus"),
    ("find derivative", "calculus"),

    # CALCULUS – INTEGRALS
    ("integrate x^2 dx", "calculus"),
    ("integrate sin(x) dx", "calculus"),
    ("find integral of x^3", "calculus"),
    ("∫ x^2 dx", "calculus"),

    # LIMITS (still routed to calculus later)
    ("lim x->0 sin(x)/x", "limits"),
    ("limit as x approaches 0 of x^2", "limits"),
    ("lim x->infinity 1/x", "limits"),

    # TRIGONOMETRY
    ("sin(x) + cos(x)", "trigonometry"),
    ("tan(theta) = 1", "trigonometry"),
    ("sin x", "trigonometry"),
    ("cos x", "trigonometry"),
    ("simplify sin^2x + cos^2x", "trigonometry"),
    ("value of tan 45", "trigonometry"),
]

texts, labels = zip(*data)

# --------------------------------------------------
# Vectorization (stronger feature extraction)
# --------------------------------------------------
vectorizer = TfidfVectorizer(
    ngram_range=(1, 3),
    lowercase=True,
    analyzer="char_wb",
    min_df=1,
    max_df=0.95
)
X = vectorizer.fit_transform(texts)

# --------------------------------------------------
# Model
# --------------------------------------------------
model = LogisticRegression(
    max_iter=2000,
    class_weight="balanced"
)
model.fit(X, labels)

# --------------------------------------------------
# Save artifacts
# --------------------------------------------------
ML_DIR = Path(__file__).parent
ML_DIR.mkdir(parents=True, exist_ok=True)

joblib.dump(model, ML_DIR / "model.joblib")
joblib.dump(vectorizer, ML_DIR / "vectorizer.joblib")

print("✅ ML classifier trained with improved accuracy")