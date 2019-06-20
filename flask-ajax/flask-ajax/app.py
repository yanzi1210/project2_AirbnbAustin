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
# @app.route("/<ZIPCODE>")
# def metadata(ZIPCODE):
#      ZipData = df.loc[df['neighbourhood'] == ZIPCODE]
#      return ZipData
@app.route("/zipcodes")
def zips():
    """Return a list of unique zipcodes."""
    data = {
         "zips": df.neighbourhood.unique().tolist()
    }
    return jsonify(data)


@app.route("/zipcode/listings/<zipdata>")
def zipcodelistings(zipdata):
     # Zips = df['neighbourhood'].unique()
     # return Zips
     filtered_df = df[df.neighbourhood == int(zipdata)]
     zip_df = filtered_df.groupby("room_type")["room_type"].count()
     #price_df = filtered_df.groupby("room_type")["price"].mean()
     jsondump = zip_df.to_json()
     return jsondump

@app.route("/zipcode/price/<zipcode>")
def zipcodeprice(zipcode):
     filtered_df = df[df.neighbourhood == (int(zipcode))]
     price_df = round(filtered_df.groupby("room_type")["price"].mean(),2)
     jsondump = price_df.to_json()
     return jsondump

@app.route("/zipchart/<zipdata>")
def zipchart(zipdata):
     filtered_df = df[df.neighbourhood == (int(zipdata))]
     data = {
        "Roomtype_Listings": filtered_df.groupby("room_type")["room_type"].count().to_json(),
        "Roomtype_avgprice": round(filtered_df.groupby("room_type")["price"].mean(),2).to_json(),
        "Roomtype_Reviews": filtered_df.groupby("room_type")["number_of_reviews"].sum().to_json(),
     }
     return jsonify(data)

@app.route("/dtable")
def table():
     return render_template("table.html")
@app.route('/ajax')
def hello_world(name=None):
     return df.to_json(orient='records')

if __name__ == '__main__':
    app.run()