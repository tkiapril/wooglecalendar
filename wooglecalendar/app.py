""":mod:`wooglecalendar.app` --- Flask web app for Woogle Calendar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

"""

from flask import Flask

from .db import setup_session

__all__ = 'app',


#: (:class:`flask.Flask`) The Flask application object.
app = Flask(__name__)
setup_session(app)


@app.route('/')
def calendar():
    return "Hello World!"


@app.route('/schedule/<int:schedule_id>')
def schedule(schedule_id):
    return "Schedule no. {}".format(schedule_id)