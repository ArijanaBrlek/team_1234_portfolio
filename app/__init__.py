from flask import Flask
from pymongo import MongoClient

app = Flask(__name__, template_folder="views/")
db = MongoClient().hackaton

from app import index
