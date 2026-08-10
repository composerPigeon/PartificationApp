from flask_sqlalchemy import SQLAlchemy

from db import db

class RepositoryBase:
    db: SQLAlchemy
    session: SQLAlchemy.Session

    def __init__(self):
        self.db = db
        self.session = db.session

    def commit_session(self):
        self.session.commit()
    def rollback_session(self):
        self.session.rollback()