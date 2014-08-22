""":mod:`woogle` --- Flask Backend for Woogle Calendar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

"""

from flask import Flask
app = Flask(__name__)

@app.route('/')
def calendar():
    return "Hello World!"

@app.route('/schedule/<int:schedule_id>')
def schedule(schedule_id):
    return "Schedule no. {}".format(schedule_id)

def main():
    app.run()

if __name__ == "__main__":
    main()