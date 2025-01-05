from flask import Blueprint, jsonify
import fastf1

drivers_bp = Blueprint('drivers', __name__)

@drivers_bp.route('/drivers/<int:year>/<string:race>', methods=['GET'])
def get_drivers(year, race):
    try:
        fastf1.Cache.enable_cache('cache')  # Cache dizini
        session = fastf1.get_session(year, race, 'R')
        session.load()
        drivers = [{"code": driver, "name": session.get_driver(driver)["FullName"]} for driver in session.drivers]
        return jsonify({"drivers": drivers}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
