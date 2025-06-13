from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
import re
from datetime import timedelta
from flask_bcrypt import Bcrypt

auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def is_valid_email(email):
    pattern = r'^[\w.-]+@[\w.-]+.\w+$'
    return re.match(pattern, email) is not None

def is_valid_password(password):
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    return True, None

def init_auth(app):
    bcrypt.init_app(app)
    # Create default test account if it doesn't exist
    default_username = 'PRAVESH'
    default_password = 'PRAVESH'
    if not User.query.filter_by(username=default_username).first():
        hashed_password = bcrypt.generate_password_hash(default_password).decode('utf-8')
        default_user = User(username=default_username, email='pravesh@example.com', password=hashed_password)
        db.session.add(default_user)
        db.session.commit()

def register_user(username, email, password):
    try:
        if User.query.filter_by(username=username).first():
            return {"error": "Username already exists"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return {"message": "User created successfully"}, 201

    except Exception as e:
        db.session.rollback()
        return {"error": f"Registration failed: {str(e)}"}, 500

def login_user(username, password):
    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return {"error": "Invalid username or password"}, 401

    access_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(days=1)
    )

    return {
        "access_token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }, 200

@auth.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400

        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        is_valid, password_error = is_valid_password(password)
        if not is_valid:
            return jsonify({'error': password_error}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, email=email, password=hashed_password)

        db.session.add(user)
        try:
            db.session.commit()
        except Exception as commit_error:
            db.session.rollback()
            return jsonify({'error': 'Failed to save user to database', 'details': str(commit_error)}), 500

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'username': user.username,
                'email': user.email
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not all(k in data for k in ['username', 'password']):
            return jsonify({'error': 'Missing username or password'}), 400

        user = User.query.filter_by(username=data['username']).first()
        if not user or not bcrypt.check_password_hash(user.password, data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401

        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=1)
        )

        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200

    except Exception as e:
        return jsonify({'error': 'Login failed. Please try again.', 'details': str(e)}), 500

@auth.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at.isoformat() if user.created_at else None
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch profile', 'details': str(e)}), 500