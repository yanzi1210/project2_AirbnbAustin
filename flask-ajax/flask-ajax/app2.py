import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from config import password

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://root:{password}@localhost:3306/airbnbaustin_db"
db = SQLAlchemy(app)
# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Austin_listings = Base.classes.keys()
print(Austin_listings)
#################################################
# Flask Routes
#################################################
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route('/ajax')
def table():
     stmt = db.session.query(austin_listings).statement
     df = pd.read_sql_query(stmt, db.session.bind)
    
     # Return a list of the column names (sample names)
     return jsonify(list(df.columns)[2:])



if __name__ == '__main__':
    app.run()