import mysql.connector
from flask import g

def get_db():
    """Get database connection from Flask's g object or create a new one"""
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host="localhost",
            user="root",
            password= "",
            database="eventify"
        )
    return g.db

def init_db(app):
    """Configure database connection for the Flask app"""
    @app.before_request
    def before_request():
        # Connection will be created when needed through get_db()
        pass
        
    @app.teardown_appcontext
    def teardown_db(exception=None):
        """Close the database connection when the app context ends"""
        db = g.pop('db', None)
        if db is not None:
            db.close()

