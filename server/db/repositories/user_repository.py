from .respository_base import RepositoryBase
from model import User

class UserRepository(RepositoryBase):
    def get_by_id(self, user_id: int) -> User | None:
        db_user = self.session.execute(
            self.db.select(User).where(User.id == user_id)
        ).scalar_one_or_none()
        return db_user

    def get_by_email(self, email: str) -> User | None:
        user = self.session.execute(
            self.db.select(User).where(User.email == email)
        ).scalar_one_or_none()
        return user

    def exist(self, email: str) -> bool:
        user = self.session.execute(
            self.db.select(User).where(User.email == email)
        ).scalar_one_or_none()
        return user is not None

    def add_user(self, user: User):
        self.session.add(user)
