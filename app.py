from flask import Flask, jsonify
from flask_cors import CORS
import fastf1

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return {"message": "Formula 1 Telemetry Tool API"}

@app.route('/api/drivers/<int:year>/<string:race>', methods=['GET'])
def get_drivers(year, race):
    fastf1.Cache.enable_cache('cache')
    session = fastf1.get_session(year, race, 'R')
    session.load()
    drivers = [{"code": driver, "name": session.get_driver(driver)["FullName"]} for driver in session.drivers]
    return jsonify({"drivers": drivers})

@app.route('/api/telemetry/<int:year>/<string:race>/<string:driver>', methods=['GET'])
def get_telemetry(year, race, driver):
    fastf1.Cache.enable_cache('cache')
    session = fastf1.get_session(year, race, 'R')
    session.load()
    laps = session.laps.pick_driver(driver)
    telemetry = laps.iloc[0].get_telemetry()  # İlk turun telemetri verisini alıyoruz

    data = {
        "speed": telemetry['Speed'].tolist(),
        "rpm": telemetry['RPM'].tolist(),
        "throttle": telemetry['Throttle'].tolist(),
        "brake": telemetry['Brake'].tolist(),
        "time": telemetry['Time'].astype(str).tolist()
    }
    return jsonify({"telemetry": data})

if __name__ == '__main__':
    app.run(debug=True)
