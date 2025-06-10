# IPL Toss to Win Predictor Backend

This is the backend service for the IPL Toss to Win Predictor. It provides a machine learning model that predicts match outcomes based on toss decisions and other match factors in IPL cricket matches.

## Features

- RESTful API endpoints for match prediction
- Machine Learning model trained on historical IPL data
- Flask-based web server with CORS support
- Pickle-based model serialization
- Data preprocessing and feature engineering

## Tech Stack

- Python 3.x
- Flask (Web Framework)
- Scikit-learn (Machine Learning)
- Pandas (Data Processing)
- Flask-CORS (Cross-Origin Resource Sharing)

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── ipl.py             # IPL data processing and model training
├── matches.csv        # Historical IPL match data
├── requirements.txt   # Python dependencies
├── run.sh            # Shell script to run the server
├── model_features.pkl # Saved model features
└── ipl_toss_win_model.pkl # Trained ML model
```

## Getting Started

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the server:
```bash
python app.py
# Or use the shell script:
./run.sh
```

The server will start on http://localhost:5002

## API Endpoints

### Predict Match Outcome
- **URL**: `/predict`
- **Method**: `POST`
- **Data Parameters**:
  ```json
  {
    "team1": "string",
    "team2": "string",
    "toss_winner": "string",
    "toss_decision": "string",
    "city": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "result": "string"
  }
  ```

## Model Information

The prediction model is trained on historical IPL match data and considers various factors including:
- Team performance
- Toss decisions
- Venue statistics
- Historical head-to-head records

## Environment Setup

Requirements:
- Python 3.x
- pip package manager
- Virtual environment (recommended)

## Data Sources

The model is trained using historical IPL match data from matches.csv, which includes:
- Match results
- Toss decisions
- Team information
- Venue details

## Contributing

Feel free to submit issues and enhancement requests. To contribute:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Maintenance

To retrain the model with new data:
1. Update matches.csv with new match data
2. Run ipl.py to retrain the model
3. The new model will be saved automatically 