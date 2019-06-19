import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from config import password
from flask import Flask, jsonify, render_template


engine = create_engine(f'mysql+pymysql://root:{password}@localhost:3306/airbnbaustin_db')

# Query All Records in the the Database
data = engine.execute("SELECT * FROM finalairbnba_data")

df = pd.read_sql("SELECT * FROM finalairbnba_data", con=engine)
print(df)
#################################################
# Flask Setup
#################################################
app = Flask(__name__,template_folder='./templates')

#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
     return render_template("index.html")
@app.route("/<ZIPCODE>")
def metadata(ZIPCODE):
     ZipData = df.loc[df['neighbourhood'] == ZIPCODE]
     return ZipData
@app.route("/dtable")
def table():
     return render_template("table.html")
@app.route('/ajax')
def hello_world(name=None):
     return df.to_json(orient='records')
     
if __name__ == '__main__':
    app.run()