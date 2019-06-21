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
geodata = engine.execute("SELECT * FROM airbnbageojson_data")

df = pd.read_sql("SELECT * FROM finalairbnba_data", con=engine)

geo_df = pd.read_sql("SELECT * FROM airbnbageojson_data", con=engine)
print(geo_df)
#################################################
# Flask Setup
#################################################
app = Flask(__name__,template_folder='./templates')

#################################################
# Flask Routes
#################################################

# approute that renders index page
@app.route("/")
def index():
     return render_template("chartjs.html")

# app route for getting zipcodes as a list for populating dropdown
@app.route("/zipcodes")
def zips():
    """Return a list of unique zipcodes."""
    data = {
         "zips": df.neighbourhood.unique().tolist()
    }
    return jsonify(data)
# app route to get data for populating listings per room_type when a zip code is selected
@app.route("/zipcode/listings/<zipdata>")
def zipcodelistings(zipdata):
     # gets all the data for a zipcode that matches with the selection
     filtered_df = df[df.neighbourhood == int(zipdata)]
     zip_df = filtered_df.groupby("room_type")["room_type"].count()
     jsondump = zip_df.to_json()
     return jsondump
# app route for grtting avg price for each roomtype for a zipcode selected
@app.route("/zipcode/price/<zipcode>")
def zipcodeprice(zipcode):
     filtered_df = df[df.neighbourhood == (int(zipcode))]
     price_df = round(filtered_df.groupby("room_type")["price"].mean(),2)
     jsondump = price_df.to_json()
     return jsondump
# app route for chart.js data
@app.route("/zipchart/<zipdata>")
def zipchart(zipdata):
     filtered_df = df[df.neighbourhood == (int(zipdata))]
     data = {
        "Roomtype_Listings": filtered_df.groupby("room_type")["room_type"].count().to_json(),
        "Roomtype_avgprice": round(filtered_df.groupby("room_type")["price"].mean(),2).to_json(),
        "Roomtype_Reviews": filtered_df.groupby("room_type")["number_of_reviews"].sum().to_json(),
     }
     return jsonify(data)

# app route for returning leaflet map data jsonified
@app.route("/leaflet/<zipcode>")
def lmap(zipcode):
     filtered_df = df[df.neighbourhood == (int(zipcode))]

     return filtered_df.to_json()

# app route for rendering leaflet map
@app.route("/leafletmap")
def getmap():
     return render_template("leaflet.html")

# app route for rendering DataTable
@app.route("/dtable")
def table():
     return render_template("table.html")
# app route for getting dtable data
@app.route('/ajax')
def hello_world(name=None):
     return df.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=False)