from flask import Flask
from flask_cors import CORS
from backend.routes.auth_routes import auth_bp
from backend.routes.event_routes import event_bp
from backend.routes.ticket_routes import ticket_bp
from backend.db_config import init_db

def create_app():
    app = Flask(__name__)
    CORS(app)
    init_db(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(event_bp, url_prefix='/api/events')
    app.register_blueprint(ticket_bp, url_prefix='/api/tickets')

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
