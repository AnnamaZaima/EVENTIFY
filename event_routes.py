from flask import Blueprint, request, jsonify
from db_config import mysql

event_bp = Blueprint('event', __name__)

# Post a new event
@event_bp.route('/api/events', methods=['POST'])
def post_event():
    data = request.get_json()
    event_name = data['event_name']
    username = data['username']
    details = data.get('details')
    event_date = data.get('event_date')
    event_link = data.get('event_link')

    cursor = mysql.connection.cursor()
    cursor.execute("""INSERT INTO event (Event_name, username, details, Event_date, Event_link)
                      VALUES (%s, %s, %s, %s, %s)""",
                   (event_name, username, details, event_date, event_link))
    mysql.connection.commit()
    return jsonify({'message': 'Event posted successfully'}), 201

# Fetch all events
@event_bp.route('/api/events', methods=['GET'])
def get_events():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM event")
    events = cursor.fetchall()

    columns = [desc[0] for desc in cursor.description]
    events_list = [dict(zip(columns, row)) for row in events]

    return jsonify(events_list), 200

# Filter events by club username
@event_bp.route('/api/events/<username>', methods=['GET'])
def get_events_by_club(username):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM event WHERE username = %s", (username,))
    events = cursor.fetchall()

    columns = [desc[0] for desc in cursor.description]
    events_list = [dict(zip(columns, row)) for row in events]

    return jsonify(events_list), 200
