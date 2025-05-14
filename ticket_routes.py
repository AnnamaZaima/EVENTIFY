##TOO TIRED TO DO THIS
from flask import Blueprint, request, jsonify
from db_config import mysql

ticket_bp = Blueprint('ticket', __name__)

# Submit a ticket
@ticket_bp.route('/api/tickets', methods=['POST'])
def submit_ticket():
    data = request.get_json()
    user_email = data['user_email']
    subject = data['subject']
    message = data['message']
    club_name = data['club_name']

    cursor = mysql.connection.cursor()
    cursor.execute("""INSERT INTO ticket (user_email, subject, message, club_name)
                      VALUES (%s, %s, %s, %s)""",
                   (user_email, subject, message, club_name))
    mysql.connection.commit()
    return jsonify({'message': 'Ticket submitted successfully'}), 201

# Get all tickets for a club
@ticket_bp.route('/api/tickets/<club_name>', methods=['GET'])
def get_tickets(club_name):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM ticket WHERE club_name = %s", (club_name,))
    tickets = cursor.fetchall()

    columns = [desc[0] for desc in cursor.description]
    ticket_list = [dict(zip(columns, row)) for row in tickets]

    return jsonify(ticket_list), 200

# Respond to a ticket
@ticket_bp.route('/api/tickets/respond/<int:ticket_id>', methods=['POST'])
def respond_ticket(ticket_id):
    data = request.get_json()
    response = data['response']

    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE ticket SET response = %s, status = 'closed' WHERE ticket_id = %s", (response, ticket_id))
    mysql.connection.commit()
    return jsonify({'message': 'Response sent'}), 200
