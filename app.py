from flask import Flask, jsonify, render_template
import fastf1

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry_data():
    try:
        session = fastf1.get_session(2024, 1, 'R')  # Use correct session data
        session.load()

        telemetry = session.laps.pick_driver('VER').get_telemetry()
        telemetry = telemetry.astype({'X': 'float', 'Y': 'float', 'Z': 'float'})

        labels = telemetry['Time'].dt.total_seconds().astype(int).tolist()
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

