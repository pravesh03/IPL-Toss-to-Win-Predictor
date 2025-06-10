from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load model and expected feature columns
model = joblib.load("ipl_toss_win_model.pkl")
model_cols = joblib.load("model_features.pkl")

# Valid categories for basic input validation
valid_teams = [
    "Mumbai Indians", "Delhi Capitals", "Chennai Super Kings",
    "Kolkata Knight Riders", "Rajasthan Royals", "Royal Challengers Bangalore",
    "Sunrisers Hyderabad", "Lucknow Super Giants", "Gujarat Titans", "Punjab Kings"
]

valid_cities = [
    "Mumbai", "Delhi", "Chennai", "Kolkata", "Hyderabad",
    "Ahmedabad", "Bangalore", "Jaipur", "Pune"
]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("Incoming data:", data)

        # Validation
        if (
            data["team1"] not in valid_teams or
            data["team2"] not in valid_teams or
            data["toss_winner"] not in valid_teams or
            data["city"] not in valid_cities or
            data["toss_decision"] not in ["bat", "field"]
        ):
            return jsonify({"result": "Invalid input — team or city not in training data."}), 400

        # Create DataFrame
        input_df = pd.DataFrame([data])

        # One-hot encode input (make sure drop_first=False in training!)
        input_encoded = pd.get_dummies(input_df)  # <-- no drop_first
        input_encoded = input_encoded.reindex(columns=model_cols, fill_value=0)

        print("Encoded input to model:\n", input_encoded.head())  # Debugging

        # Prediction
        prob = model.predict_proba(input_encoded)[0][1]
        print("Predicted probability:", prob)

        return jsonify({"result": f"Predicted Toss-Win Probability: {prob:.2%}"})

    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"result": "Error processing prediction."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5002)
