from __future__ import annotations

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session, scoped_session

from db import db


class RepositoryBase:
    db: SQLAlchemy
    session: scoped_session[Session]

    def __init__(self) -> None:
        self.db = db
        self.session = db.session

    def commit_session(self) -> None:
        self.session.commit()

    def rollback_session(self) -> None:
        self.session.rollback()
