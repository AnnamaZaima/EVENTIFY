from flask import Blueprint, request, jsonify
from db_config import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    club_name = data.get('club_name')
    club_email = data['club_email']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO club (club_name, username, club_email, password) VALUES (%s, %s, %s, %s)",
                       (club_name, username, club_email, password))
        conn.commit()
        return jsonify({"message": "Registration successful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()
