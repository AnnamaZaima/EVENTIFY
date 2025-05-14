from flask import Blueprint, request, jsonify
from db_config import get_db

club_bp = Blueprint('club', __name__)

# Create a new club
@club_bp.route('/api/clubs', methods=['POST'])
def create_club():
    data = request.get_json()
    name = data['name']
    description = data['description']
    leader_id = data['leader_id']  # User ID of the club creator
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Start transaction
        cursor.execute("START TRANSACTION")
        
        # Create the club
        cursor.execute(
            "INSERT INTO clubs (name, description, leader_id) VALUES (%s, %s, %s)",
            (name, description, leader_id)
        )
        club_id = cursor.lastrowid
        
        # Add the creator as a leader in club_memberships
        cursor.execute(
            "INSERT INTO club_memberships (user_id, club_id, role) VALUES (%s, %s, 'leader')",
            (leader_id, club_id)
        )
        
        # Commit transaction
        db.commit()
        
        return jsonify({
            'message': 'Club created successfully',
            'club_id': club_id
        }), 201
        
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()

# Get all clubs
@club_bp.route('/api/clubs', methods=['GET'])
def get_all_clubs():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT c.*, u.full_name as leader_name 
            FROM clubs c
            LEFT JOIN users u ON c.leader_id = u.id
            ORDER BY c.created_at DESC
        """)
        clubs = cursor.fetchall()
        
        return jsonify({'clubs': clubs}), 200
    finally:
        cursor.close()

# Get club by ID
@club_bp.route('/api/clubs/<int:club_id>', methods=['GET'])
def get_club(club_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Get club details
        cursor.execute("""
            SELECT c.*, u.full_name as leader_name 
            FROM clubs c
            LEFT JOIN users u ON c.leader_id = u.id
            WHERE c.id = %s
        """, (club_id,))
        club = cursor.fetchone()
        
        if not club:
            return jsonify({'error': 'Club not found'}), 404
            
        # Get club members
        cursor.execute("""
            SELECT u.id, u.full_name, cm.role, cm.joined_at
            FROM users u
            JOIN club_memberships cm ON u.id = cm.user_id
            WHERE cm.club_id = %s
            ORDER BY cm.role DESC, cm.joined_at
        """, (club_id,))
        members = cursor.fetchall()
        
        # Get upcoming events
        cursor.execute("""
            SELECT *
            FROM events
            WHERE club_id = %s AND date >= NOW()
            ORDER BY date
        """, (club_id,))
        upcoming_events = cursor.fetchall()
        
        # Add members and events to club data
        club['members'] = members
        club['upcoming_events'] = upcoming_events
        
        return jsonify(club), 200
    finally:
        cursor.close()

# Join a club
@club_bp.route('/api/clubs/<int:club_id>/join', methods=['POST'])
def join_club(club_id):
    data = request.get_json()
    user_id = data['user_id']
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Check if user is already a member
        cursor.execute(
            "SELECT * FROM club_memberships WHERE user_id = %s AND club_id = %s",
            (user_id, club_id)
        )
        if cursor.fetchone():
            return jsonify({'message': 'Already a member of this club'}), 409
            
        # Add user as a member
        cursor.execute(
            "INSERT INTO club_memberships (user_id, club_id, role) VALUES (%s, %s, 'member')",
            (user_id, club_id)
        )
        db.commit()
        
        return jsonify({'message': 'Successfully joined the club'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()

# Leave a club
@club_bp.route('/api/clubs/<int:club_id>/leave', methods=['POST'])
def leave_club(club_id):
    data = request.get_json()
    user_id = data['user_id']
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Check if user is a leader of the club
        cursor.execute(
            "SELECT * FROM club_memberships WHERE user_id = %s AND club_id = %s AND role = 'leader'",
            (user_id, club_id)
        )
        if cursor.fetchone():
            # Count how many leaders the club has
            cursor.execute(
                "SELECT COUNT(*) as leader_count FROM club_memberships WHERE club_id = %s AND role = 'leader'",
                (club_id,)
            )
            result = cursor.fetchone()
            if result['leader_count'] <= 1:
                return jsonify({'error': 'Cannot leave club. You are the only leader. Appoint another leader first or delete the club.'}), 400
        
        # Remove user from club
        cursor.execute(
            "DELETE FROM club_memberships WHERE user_id = %s AND club_id = %s",
            (user_id, club_id)
        )
        db.commit()
        
        return jsonify({'message': 'Successfully left the club'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()