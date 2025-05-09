from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db_config import mysql

auth_bp = Blueprint('auth', __name__)

# Register a new user or club
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = generate_password_hash(data['password'])
    club_name = data.get('club_name')
    club_email = data.get('club_email')

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO club (username, password, club_name, club_email) VALUES (%s, %s, %s, %s)",
                       (username, password, club_name, club_email))
        mysql.connection.commit()
        return jsonify({'message': 'Registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Login for user/club
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT password FROM club WHERE username = %s", (username,))
    result = cursor.fetchone()

    if result and check_password_hash(result[0], password):
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401
