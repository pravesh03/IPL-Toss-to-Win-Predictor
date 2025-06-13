from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import pandas as pd
import joblib
import logging
from datetime import datetime, timedelta
import os
from models import db, User, Prediction
from auth import init_auth, register_user, login_user
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Allow all origins in development
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Configure app settings
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/toss_predictor')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

# Initialize extensions
jwt = JWTManager(app)
db.init_app(app)

# Create database tables and default test account within app context
with app.app_context():
    db.create_all()
    init_auth(app)  # Ensure default test account is created

# Register blueprints
from auth import auth as auth_blueprint
app.register_blueprint(auth_blueprint, url_prefix='/auth')

# Load model and features
try:
    model = joblib.load("ipl_toss_win_model.pkl")
    model_cols = joblib.load("model_features.pkl")
    logger.info("Model and features loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

valid_teams = [
    "Mumbai Indians", "Delhi Capitals", "Chennai Super Kings",
    "Kolkata Knight Riders", "Rajasthan Royals", "Royal Challengers Bangalore",
    "Sunrisers Hyderabad", "Lucknow Super Giants", "Gujarat Titans", "Punjab Kings"
]

valid_cities = [
    "Mumbai", "Delhi", "Chennai", "Kolkata", "Hyderabad",
    "Ahmedabad", "Bangalore", "Jaipur", "Pune"
]

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if not data or not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({"error": "Missing required fields"}), 400
    return register_user(data['username'], data['email'], data['password'])

def validate_input(data):
    required_fields = ['team1', 'team2', 'toss_winner', 'toss_decision', 'city']
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"Missing required field: {field}"
    
    if data['team1'] not in valid_teams:
        return False, f"Invalid team1: {data['team1']}"
    if data['team2'] not in valid_teams:
        return False, f"Invalid team2: {data['team2']}"
    if data['team1'] == data['team2']:
        return False, "Team1 and Team2 cannot be the same"
    if data['toss_winner'] not in [data['team1'], data['team2']]:
        return False, "Toss winner must be one of the playing teams"
    if data['toss_decision'] not in ['bat', 'field']:
        return False, "Toss decision must be either 'bat' or 'field'"
    if data['city'] not in valid_cities:
        return False, f"Invalid city: {data['city']}"
    
    return True, None

@app.route("/predict", methods=["POST"])
#@jwt_required()
def predict():
    try:
        data = request.json
        #user_id = get_jwt_identity()
        user_id = 1  # Temporary default user ID
        logger.info(f"Received prediction request: {data}")

        # Input validation
        is_valid, error_message = validate_input(data)
        if not is_valid:
            logger.warning(f"Invalid input: {error_message}")
            return jsonify({"error": f"Invalid input — {error_message}"}), 400

        # Create DataFrame and encode
        try:
            input_df = pd.DataFrame([data])
            input_encoded = pd.get_dummies(input_df)
            input_encoded = input_encoded.reindex(columns=model_cols, fill_value=0)
            logger.info("Data preprocessing successful")
        except Exception as e:
            logger.error(f"Error in data preprocessing: {str(e)}")
            return jsonify({"error": "Error in data preprocessing"}), 500

        # Make prediction
        try:
            prob = model.predict_proba(input_encoded)[0][1]
            logger.info(f"Prediction successful: {prob:.2%}")

            # Load historical data for team analysis
            df = pd.read_csv("matches.csv")
            
            # Team 1 stats
            team1_matches = df[(df['team1'] == data['team1']) | (df['team2'] == data['team1'])]
            team1_stats = {
                'total_matches': len(team1_matches),
                'toss_wins': len(df[df['toss_winner'] == data['team1']]),
                'match_wins': len(df[df['winner'] == data['team1']]),
                'win_rate': len(df[df['winner'] == data['team1']]) / len(team1_matches) if len(team1_matches) > 0 else 0
            }
            
            # Team 2 stats
            team2_matches = df[(df['team1'] == data['team2']) | (df['team2'] == data['team2'])]
            team2_stats = {
                'total_matches': len(team2_matches),
                'toss_wins': len(df[df['toss_winner'] == data['team2']]),
                'match_wins': len(df[df['winner'] == data['team2']]),
                'win_rate': len(df[df['winner'] == data['team2']]) / len(team2_matches) if len(team2_matches) > 0 else 0
            }
            
            # Head to head stats
            h2h_matches = df[((df['team1'] == data['team1']) & (df['team2'] == data['team2'])) |
                           ((df['team1'] == data['team2']) & (df['team2'] == data['team1']))]
            h2h_stats = {
                'total_matches': len(h2h_matches),
                'team1_wins': len(h2h_matches[h2h_matches['winner'] == data['team1']]),
                'team2_wins': len(h2h_matches[h2h_matches['winner'] == data['team2']]),
                'team1_toss_wins': len(h2h_matches[h2h_matches['toss_winner'] == data['team1']]),
                'team2_toss_wins': len(h2h_matches[h2h_matches['toss_winner'] == data['team2']])
            }

            # Save to DB
            prediction = Prediction(
                user_id=user_id,
                team1=data['team1'],
                team2=data['team2'],
                toss_winner=data['toss_winner'],
                toss_decision=data['toss_decision'],
                city=data['city'],
                predicted_probability=float(prob)
            )
            db.session.add(prediction)
            db.session.commit()
            logger.info("Prediction saved to database")

            return jsonify({
                "result": f"Probability of {data['toss_winner']} winning the match: {prob:.2%}",
                "team1_stats": team1_stats,
                "team2_stats": team2_stats,
                "head_to_head": h2h_stats
            }), 200
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            return jsonify({"error": "Error making prediction"}), 500

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/analysis/stats", methods=["GET"])
def get_analysis_stats():
    try:
        if not os.path.exists("matches.csv"):
            logger.error("matches.csv not found")
            return jsonify({"error": "Dataset not found"}), 500

        df = pd.read_csv("matches.csv")
        
        # Calculate toss impact
        toss_impact = {
            'toss_bat_win_rate': float((df['toss_decision'] == 'bat') & (df['toss_winner'] == df['winner']).mean()),
            'toss_field_win_rate': float((df['toss_decision'] == 'field') & (df['toss_winner'] == df['winner']).mean())
        }
        
        # Calculate team performance
        team_stats = {}
        for team in valid_teams:
            won_toss = df[df['toss_winner'] == team].shape[0]
            won_match = df[(df['toss_winner'] == team) & (df['winner'] == team)].shape[0]
            team_stats[team] = won_match / won_toss if won_toss > 0 else 0
        
        # Calculate venue stats
        venue_stats = {}
        for venue in df['venue'].dropna().unique():
            matches = df[df['venue'] == venue]
            toss_win_match_win = matches[matches['toss_winner'] == matches['winner']].shape[0]
            venue_stats[venue] = toss_win_match_win / matches.shape[0]
        
        return jsonify({
            'toss_impact': toss_impact,
            'team_stats': team_stats,
            'venue_stats': venue_stats
        })
        
    except Exception as e:
        logger.error(f"Error getting analysis stats: {str(e)}")
        return jsonify({"error": "Failed to get analysis stats"}), 500

@app.route("/analysis/real-time", methods=["POST"])
@jwt_required()
def get_real_time_analysis():
    try:
        data = request.json
        user_id = get_jwt_identity()
        
        # Analyze current input
        input_df = pd.DataFrame([data])
        input_encoded = pd.get_dummies(input_df)
        input_encoded = input_encoded.reindex(columns=model_cols, fill_value=0)
        current_prob = model.predict_proba(input_encoded)[0][1]
        
        # Get user's prediction history
        user_predictions = Prediction.query.filter_by(user_id=user_id).all()
        
        historical_stats = {
            'total_predictions': len(user_predictions),
            'similar_situations': 0,
            'similar_success_rate': 0,
            'team_performance': {
                data['team1']: {'total': 0, 'won_toss': 0},
                data['team2']: {'total': 0, 'won_toss': 0}
            }
        }
        
        similar_probs = []
        for pred in user_predictions:
            # Track team performance
            for team in [pred.team1, pred.team2]:
                if team in historical_stats['team_performance']:
                    historical_stats['team_performance'][team]['total'] += 1
                    if pred.toss_winner == team:
                        historical_stats['team_performance'][team]['won_toss'] += 1
            
            # Find similar situations
            if pred.city == data['city'] and {pred.team1, pred.team2} == {data['team1'], data['team2']}:
                historical_stats['similar_situations'] += 1
                similar_probs.append(pred.predicted_probability)
        
        # Calculate success rates
        if similar_probs:
            historical_stats['similar_success_rate'] = float(np.mean(similar_probs))
        
        # Calculate team-specific stats
        for team in historical_stats['team_performance']:
            perf = historical_stats['team_performance'][team]
            perf['win_rate'] = perf['won_toss'] / perf['total'] if perf['total'] > 0 else 0
        
        # Generate insights
        insights = [
            f"{team} has won {stats['won_toss']} of {stats['total']} tosses ({stats['win_rate']:.1%})"
            for team, stats in historical_stats['team_performance'].items() if stats['total'] > 0
        ]
        
        if historical_stats['similar_situations'] > 0:
            insights.append(
                f"In {historical_stats['similar_situations']} similar matches at {data['city']}, "
                f"average win probability was {historical_stats['similar_success_rate']:.1%}"
            )
        
        insights.append(f"Current prediction shows a {current_prob:.1%} chance that toss winner wins the match")
        
        return jsonify({
            'current_prediction': current_prob,
            'historical_stats': historical_stats,
            'insights': insights
        })
        
    except Exception as e:
        logger.error(f"Error in real-time analysis: {str(e)}")
        return jsonify({"error": "Failed to generate analysis"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5010, debug=True)







