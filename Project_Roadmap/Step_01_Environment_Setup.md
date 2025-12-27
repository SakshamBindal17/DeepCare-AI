# Step 01: Environment Setup & Project Structure

## Objective
Initialize the project repository, set up the Python virtual environment, and create the directory structure to support the modular architecture required for the hackathon.

## Actions

1.  **Create Directory Structure**:
    *   `backend/` - For Flask application and services (Saksham's Workspace).
    *   `backend/services/` - For external API integrations.
    *   `backend/logic/` - For core business logic (Risk Engine).
    *   `frontend/` - For HTML/CSS/JS (Mokshit's Workspace).
    *   `tests/` - For QA scripts (Ishan's Workspace).
    *   `research/` - For data dictionaries.
    *   `Audio_Recordings/` - (Already exists) For input files.
    *   `Transcripts/` - (Already exists) For output text files.

2.  **Virtual Environment**:
    *   Create a Python virtual environment: `python -m venv venv`.
    *   Activate the environment:
        *   Windows: `.\venv\Scripts\activate`
        *   Mac/Linux: `source venv/bin/activate`

3.  **Dependencies**:
    *   Create `requirements.txt` with the following core libraries:
        ```text
        flask
        flask-cors
        python-dotenv
        deepgram-sdk
        boto3
        requests
        ```

4.  **Configuration**:
    *   Create a `.env` file (and `.env.example`) to store API keys.
        ```text
        DEEPGRAM_API_KEY=your_deepgram_key
        AWS_ACCESS_KEY_ID=your_aws_key
        AWS_SECRET_ACCESS_KEY=your_aws_secret
        AWS_REGION=us-east-1
        ```

## Verification
*   Run `pip install -r requirements.txt` to ensure all packages install without error.
*   Verify the folder structure exists.
