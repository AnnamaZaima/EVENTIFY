from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from db_config import get_db

auth_bp = Blueprint('auth', __name__)

# Register a new student account
@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    full_name = data['full_name']
    password = generate_password_hash(data['password'])
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already registered'}), 409
        name,domain=email.split("@")
        if domain!="g.bracu.ac.bd":
            return jsonify({'error': 'Please use correct domain'}), 409
        if len(name)<3:
            return jsonify({'error': 'Invalid Email address'}), 409
        for i in range(len(full_name)):
            val=ord(full_name[i])
            if 64<val<91 or 96<val<123 or full_name[i]==" ":
                pass
            else:
                return jsonify({'error': 'Name only contains characters'}), 409
        pas=data['password']
        if len(pas)<8:
            return jsonify({'error': 'Password is too short, minimum length 8 digit'}), 409
        flag=False
        for i in range (len(pas)):
            if 32<ord(pas[i])<48 or 57<ord(pas[i])<65:
                flag=True
                break
        if flag==False:
            return jsonify({'error': 'Password must contain atleast 1 special character'}), 409
            
        # Insert new user
        cursor.execute("INSERT INTO users (email, full_name, password_hash) VALUES (%s, %s, %s)",
                      (email, full_name, password))
        db.commit()
        
        # Get the newly created user ID
        user_id = cursor.lastrowid
        
        return jsonify({
            'message': 'Registration successful',
            'user_id': user_id
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        cursor.execute("SELECT id, email, full_name, password_hash FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            # Create session data without storing sensitive info
            session_data = {
                'user_id': user['id'],
                'email': user['email'],
                'full_name': user['full_name']
            }
            
            return jsonify({
                'message': 'Login successful',
                'user': session_data
            }), 200
        
        return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()

# Get current user profile
@auth_bp.route('/api/auth/profile', methods=['GET'])
def get_profile():
    # Get user ID from session or token
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
        
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Get user details
        cursor.execute("SELECT id, email, full_name, created_at FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        # Get clubs where user is a member
        cursor.execute("""
            SELECT c.id, c.name, c.description, cm.role 
            FROM clubs c
            JOIN club_memberships cm ON c.id = cm.club_id
            WHERE cm.user_id = %s
        """, (user_id,))
        clubs = cursor.fetchall()
        
        # Add clubs to user data
        user['clubs'] = clubs
        
        return jsonify(user), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()

# Logout endpoint
@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    # Clear session data
    return jsonify({'message': 'Logout successful'}), 200