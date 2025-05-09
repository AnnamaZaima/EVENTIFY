import mysql.connector
from flask import g

def init_db(app):
    def connect_db():
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="your_mysql_password",
            database="eventify"
        )
    
    @app.before_request
    def before_request():
        g.db = connect_db()
        g.cursor = g.db.cursor(dictionary=True)

    @app.teardown_request
    def teardown_request(exception):
        db = g.pop('db', None)
        if db is not None:
            db.close()
