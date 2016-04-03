from app import app, db
from flask import request, render_template
import random

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        print("test")
        id = request.form['id']
        print("test")
        person = db.people.find_one({"id": int(id)})
        print(request.form)
        new_rank = person['rank']
        print("test")
        if request.form['vote'] == "up":
            new_rank += 1
        elif request.form['vote'] == "down":
            new_rank -= 1
        print("test")
        db.people.update_one({"id": int(id)}, {"$set": {"rank": new_rank}})
    people = db.people.find()
    return render_template('index.html', people=people)
