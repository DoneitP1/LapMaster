from flask import Flask, jsonify, render_template
import fastf1

fastf1.Cache.enable_cache('cache')

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry_data():
    try:
        session = fastf1.get_session(2024, 1, 'R')
        session.load()

        telemetry = session.laps.pick_driver('VER').get_telemetry()

        if telemetry.empty:
            return jsonify({"error": "No telemetry data available for the selected driver."}), 404

        telemetry['Seconds'] = telemetry['Time'].dt.total_seconds().astype(int)
        telemetry = telemetry.drop_duplicates(subset='Seconds', keep='first')

        labels = telemetry['Seconds'].tolist()
        values = telemetry['Speed'].tolist()

        telemetry_data = {
            "labels": labels,
            "values": values
        }

        return jsonify(telemetry_data)

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
