from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.event_routes import event_bp
from routes.club_routes import club_bp
from db_config import init_db

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    
    # Session configuration
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_COOKIE_SECURE'] = False  ######you need to set this true in profuction with https if youre doing it########
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    
    init_db(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)  
    app.register_blueprint(event_bp)
    app.register_blueprint(club_bp)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)