from flask import Blueprint, request, jsonify
from db_config import get_db
from datetime import datetime

event_bp = Blueprint('event', __name__)

# Create a new event
@event_bp.route('/api/events', methods=['POST'])
def create_event():
    data = request.get_json()
    name = data['name']
    description = data['description']
    date = data['date']
    location = data.get('location')
    club_id = data['club_id']
    created_by = data['created_by']  # User ID
    types = data.get('types', [])  # list of dicts: [{type, date, time, location}]
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Verify user is a member of the club
        cursor.execute(
            "SELECT * FROM club_memberships WHERE user_id = %s AND club_id = %s",
            (created_by, club_id)
        )
        if not cursor.fetchone():
            return jsonify({'error': 'You are not authorized to create events for this club'}), 403
            
        # Create the event
        cursor.execute("""
            INSERT INTO events (name, description, date, location, club_id, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (name, description, date, location, club_id, created_by))

        for t in types:
            cursor.execute("""
                INSERT INTO event_types (event_id, type, date, time, location)
                VALUES (%s, %s, %s, %s, %s)
            """, (event_id, t['type'], t['date'], t['time'], t['location']))


        db.commit()
        
        event_id = cursor.lastrowid
        
        return jsonify({
            'message': 'Event created successfully',
            'event_id': event_id
        }), 201
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()

# Get all events
@event_bp.route('/api/events', methods=['GET'])
def get_all_events():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT e.*, c.name as club_name, u.full_name as created_by_name
            FROM events e
            JOIN clubs c ON e.club_id = c.id
            JOIN users u ON e.created_by = u.id
            ORDER BY e.date DESC
        """)
        events = cursor.fetchall()
        
        return jsonify({'events': events}), 200
    finally:
        cursor.close()

# Get events for a specific club
@event_bp.route('/api/events/club/<int:club_id>', methods=['GET'])
def get_events_by_club(club_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT e.*, c.name as club_name, u.full_name as created_by_name
            FROM events e
            JOIN clubs c ON e.club_id = c.id
            JOIN users u ON e.created_by = u.id
            WHERE e.club_id = %s
            ORDER BY e.date DESC
        """, (club_id,))
        events = cursor.fetchall()
        
        return jsonify({'events': events}), 200
    finally:
        cursor.close()

# Get event details by ID
@event_bp.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Get event details
        cursor.execute("""
            SELECT e.*, c.name as club_name, u.full_name as created_by_name
            FROM events e
            JOIN clubs c ON e.club_id = c.id
            JOIN users u ON e.created_by = u.id
            WHERE e.id = %s
        """, (event_id,))
        event = cursor.fetchone()
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        #Get types
        cursor.execute("""
            SELECT type, date, time, location
            FROM event_types
            WHERE event_id = %s
        """, (event_id,))
        event['types'] = cursor.fetchall()


            
        # Get attendance info
        cursor.execute("""
            SELECT ea.*, u.full_name
            FROM event_attendance ea
            JOIN users u ON ea.user_id = u.id
            WHERE ea.event_id = %s
        """, (event_id,))
        attendees = cursor.fetchall()
        
        # Add attendees to event data
        event['attendees'] = attendees
        
        return jsonify(event), 200
    finally:
        cursor.close()

# Register to attend an event
@event_bp.route('/api/events/<int:event_id>/attend', methods=['POST'])
def attend_event(event_id):
    data = request.get_json()
    user_id = data['user_id']
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Check if already registered
        cursor.execute(
            "SELECT * FROM event_attendance WHERE event_id = %s AND user_id = %s",
            (event_id, user_id)
        )
        if cursor.fetchone():
            return jsonify({'message': 'Already registered for this event'}), 409
            
        # Register for the event
        cursor.execute(
            "INSERT INTO event_attendance (event_id, user_id, ticket_status) VALUES (%s, %s, 'pending')",
            (event_id, user_id)
        )
        db.commit()
        
        return jsonify({'message': 'Successfully registered for the event'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()

# Cancel attendance for an event
@event_bp.route('/api/events/<int:event_id>/cancel', methods=['POST'])
def cancel_attendance(event_id):
    data = request.get_json()
    user_id = data['user_id']
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        cursor.execute(
            "UPDATE event_attendance SET ticket_status = 'cancelled' WHERE event_id = %s AND user_id = %s",
            (event_id, user_id)
        )
        db.commit()
        
        return jsonify({'message': 'Successfully cancelled event attendance'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()

@event_bp.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # Optional: Delete associated attendance first to maintain referential integrity
        cursor.execute("DELETE FROM event_attendance WHERE event_id = %s", (event_id,))

        # Delete the event
        cursor.execute("DELETE FROM events WHERE id = %s", (event_id,))
        db.commit()

        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()

@event_bp.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    date = data.get('date')
    location = data.get('location')
    types = data.get('types', [])

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            UPDATE events
            SET name = %s, description = %s, date = %s, location = %s
            WHERE id = %s
        """, (name, description, date, location, event_id))

        for t in types:
            cursor.execute("""
                INSERT INTO event_types (event_id, type, date, time, location)
                VALUES (%s, %s, %s, %s, %s)
            """, (event_id, t['type'], t['date'], t['time'], t['location']))

        db.commit()

        return jsonify({'message': 'Event updated successfully'}), 200
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
