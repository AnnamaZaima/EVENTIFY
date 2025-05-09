from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.event_routes import event_bp
from routes.ticket_routes import ticket_bp

app = Flask(__name__)
CORS(app)

# Register routes
app.register_blueprint(auth_bp)
app.register_blueprint(event_bp)
app.register_blueprint(ticket_bp)

if __name__ == '__main__':
    app.run(debug=True)
