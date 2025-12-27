# Step 02: Backend Skeleton (Flask)

## Objective
Set up the basic Flask server to serve as the core of the application. This falls under Saksham's workspace.

## Actions

1.  **Create `backend/app.py`**:
    *   Initialize the Flask app.
    *   Enable CORS (Cross-Origin Resource Sharing) to allow the frontend to communicate with it.
    *   Load environment variables using `python-dotenv`.

2.  **Create a Health Check Route**:
    *   Add a route `/health` that returns a JSON response `{"status": "healthy"}`.
    *   This confirms the server is running and accessible.

3.  **Run Script**:
    *   Create a way to run the server easily (e.g., `python backend/app.py`).

## Code Snippet (Conceptual)
```python
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "DeepCare AI Backend"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## Verification
*   Ensure your virtual environment is active (`.\venv\Scripts\activate`).
*   Run the Flask app.
*   Visit `http://localhost:5000/health` in a browser or use curl.
*   Expected Output: `{"status": "healthy", "service": "DeepCare AI Backend"}`.
