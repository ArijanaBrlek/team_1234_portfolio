from app import app, db
from flask import request, render_template, jsonify
import random
import json
from bson import json_util

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

@app.route('/people', methods=['GET'])
def get_people():
    people = db.people.find()
    people_list  = list(people)
    return json.dumps(people_list, default=json_util.default)

@app.route('/upvote/<int:id>', methods=['POST'])
def upvote(id):
    person = db.people.find_one({"id": int(id)})
    if not person:
        abort(404)

    new_rank = person['rank'] + 1
    db.people.update_one({"id": int(id)}, {"$set": {"rank": new_rank}})

    return jsonify({'rank': new_rank})