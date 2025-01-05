from flask import Blueprint, jsonify, request
import fastf1

telemetry_bp = Blueprint('telemetry', __name__)

@telemetry_bp.route('/telemetry/<int:year>/<string:race>/<string:driver>', methods=['GET'])
def get_telemetry(year, race, driver):
    try:
        fastf1.Cache.enable_cache('cache')  # Cache dizini
        session = fastf1.get_session(year, race, 'R')
        session.load()
        laps = session.laps.pick_driver(driver)
        telemetry = laps.iloc[0].get_telemetry()  # İlk tur verisini alıyoruz

        data = {
            "speed": telemetry['Speed'].tolist(),
            "rpm": telemetry['RPM'].tolist(),
            "throttle": telemetry['Throttle'].tolist(),
            "brake": telemetry['Brake'].tolist(),
            "time": telemetry['Time'].astype(str).tolist()
        }
        return jsonify({"telemetry": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
