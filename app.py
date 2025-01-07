from flask import Flask, jsonify
from flask_cors import CORS
import fastf1

app = Flask(__name__)
CORS(app)

DEFAULT_PHOTO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"

DRIVER_PROFILES = {
    "HAM": {"name": "Lewis Hamilton", "team": "Mercedes", "wins": 103, "poles": 103, "championships": 7,
            "photo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Lewis_Hamilton_2016_Malaysia_2.jpg/640px-Lewis_Hamilton_2016_Malaysia_2.jpg"},
    "VER": {"name": "Max Verstappen", "team": "Red Bull Racing", "wins": 49, "poles": 30, "championships": 2,
            "photo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Max_Verstappen_2017_Malaysia_3.jpg/640px-Max_Verstappen_2017_Malaysia_3.jpg"},
    "LEC": {"name": "Charles Leclerc", "team": "Ferrari", "wins": 5, "poles": 20, "championships": 0,
            "photo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Charles_Leclerc_2019.jpg/640px-Charles_Leclerc_2019.jpg"},
    "SAI": {"name": "Carlos Sainz", "team": "Ferrari", "wins": 1, "poles": 3, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "NOR": {"name": "Lando Norris", "team": "McLaren", "wins": 0, "poles": 1, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "ALO": {"name": "Fernando Alonso", "team": "Aston Martin", "wins": 32, "poles": 22, "championships": 2,
            "photo_url": DEFAULT_PHOTO_URL},
    "RUS": {"name": "George Russell", "team": "Mercedes", "wins": 1, "poles": 1, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "PER": {"name": "Sergio Perez", "team": "Red Bull Racing", "wins": 6, "poles": 2, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "BOT": {"name": "Valtteri Bottas", "team": "Alfa Romeo", "wins": 10, "poles": 20, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "OCO": {"name": "Esteban Ocon", "team": "Alpine", "wins": 1, "poles": 0, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "GAS": {"name": "Pierre Gasly", "team": "Alpine", "wins": 1, "poles": 0, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "MAG": {"name": "Kevin Magnussen", "team": "Haas", "wins": 0, "poles": 1, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "HUL": {"name": "Nico Hulkenberg", "team": "Haas", "wins": 0, "poles": 1, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "TSU": {"name": "Yuki Tsunoda", "team": "AlphaTauri", "wins": 0, "poles": 0, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "PIA": {"name": "Oscar Piastri", "team": "McLaren", "wins": 0, "poles": 0, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "ZHO": {"name": "Guanyu Zhou", "team": "Alfa Romeo", "wins": 0, "poles": 0, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "STR": {"name": "Lance Stroll", "team": "Aston Martin", "wins": 0, "poles": 1, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "SAR": {"name": "Logan Sargeant", "team": "Williams", "wins": 0, "poles": 0, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "DEV": {"name": "Nyck de Vries", "team": "AlphaTauri", "wins": 0, "poles": 0, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL},
    "ALB": {"name": "Alexander Albon", "team": "Williams", "wins": 0, "poles": 0, "championships": 0,
            "photo_url": DEFAULT_PHOTO_URL}
}
DRIVER_NUMBER_TO_CODE = {
    "1": "VER",
    "44": "HAM",
    "16": "LEC",
    "55": "SAI",
    "4": "NOR",
    "14": "ALO",
    "63": "RUS",
    "11": "PER",
    "77": "BOT",
    "31": "OCO",
    "10": "GAS",
    "20": "MAG",
    "27": "HUL",
    "22": "TSU",
    "81": "PIA",
    "24": "ZHO",
    "18": "STR",
    "2": "SAR",
    "21": "DEV",
    "23": "ALB"
}
@app.route('/')
def home():
    return {"message": "Formula 1 Telemetry Tool API"}

@app.route('/api/races/<int:year>', methods=['GET'])
def get_races(year):
    try:
        fastf1.Cache.enable_cache('cache')
        schedule = fastf1.get_event_schedule(year)
        races = [{"name": event['EventName'], "round": event['RoundNumber']} for _, event in schedule.iterrows()]
        return jsonify({"races": races})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/drivers/<int:year>/<int:round>/<string:session_type>', methods=['GET'])
def get_drivers(year, round, session_type):
    try:
        fastf1.Cache.enable_cache('cache')
        session = fastf1.get_session(year, round, session_type)
        session.load()
        drivers = [{"code": driver, "name": session.get_driver(driver)["FullName"]} for driver in session.drivers]
        return jsonify({"drivers": drivers})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/telemetry/<int:year>/<int:round>/<string:driver>', methods=['GET'])
def get_telemetry(year, round, driver):
    try:
        fastf1.Cache.enable_cache('cache')
        session = fastf1.get_session(year, round, 'R')  # "R" -> Race session
        session.load()
        laps = session.laps.pick_driver(driver)
        telemetry = laps.iloc[0].get_telemetry()

        data = {
            "speed": telemetry['Speed'].tolist(),
            "rpm": telemetry['RPM'].tolist(),
            "throttle": telemetry['Throttle'].tolist(),
            "brake": telemetry['Brake'].tolist(),
            "gear": telemetry['nGear'].tolist(),
            "time": telemetry['Time'].astype(str).tolist()
        }
        return jsonify({"telemetry": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/drivers/profile/<driver_code>', methods=['GET'])
def get_driver_profile(driver_code):
    """ Returns the driver profile based on the specified driver_code."""

    driver_code = DRIVER_NUMBER_TO_CODE.get(driver_code, driver_code).upper()

    profile = DRIVER_PROFILES.get(driver_code)

    if profile:
        return jsonify(profile)
    else:
        return jsonify({"error": "Driver not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
    
