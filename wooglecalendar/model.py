""":mod:`wooglecalendar.model` --- Database Models
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

"""
from sqlalchemy import Column, Boolean, DateTime, String, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import now
from sqlalchemy.sql.expression import and_

from .orm import Base


__all__ = 'Schedule', 'Comment', 'User'


class Schedule(Base):
    """Representation of a WoogleCalendar Schedule."""
    schedule_id = Column(Integer, primary_key=True, index=True, default=now())
    title = Column(String, nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True))
    allday = Column(Boolean, nullable=False, default=False)
    location = Column(String)
    description = Column(String)
    tag = Column(String)
    user_id = Column(Integer, nullable=False)

    comments = relationship('Comment')
    author = relationship('User')

    __tablename__ = 'wooglecalendar_schedules'
    __repr_columns__ = title, start_date, description


class Comment(Base):
    """Comments of a Schedule."""
    schedule_id = Column(Integer, primary_key=True, nullable=False)
    comment_id = Column(Integer, primary_key=True, index=True, default=now())
    comment = Column(String, nullable=False)
    user_id = Column(Integer, nullable=False)

    schedule = relationship('Schedule')
    author = relationship('User')

    __tablename__ = 'wooglecalendar_comments'
    __repr_columns__ = schedule_id, comment


class User(Base):
    id = Column(Integer, primary_key=True, index=True, default=now())
    username = Column(String, nullable=False, unique=True, index=True)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    registered_on = Column(DateTime, nullable=False, default=now())

    schedules = relationship('Schedule')
    comments = relationship('Comment')
 
    __tablename__ = 'wooglecalendar_users'
    __repr_columns__ = username, email