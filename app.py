from flask import Flask, jsonify, render_template
import fastf1

# Enable the FastF1 cache
fastf1.Cache.enable_cache('cache')

app = Flask(__name__)

@app.route('/')
def home():
    # Render the index.html template from the templates folder
    return render_template('index.html')

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry_data():
    try:
        # Example: 2024, round 1, Race session
        # Adjust the arguments based on actual 2024 race data availability
        session = fastf1.get_session(2024, 1, 'R')
        session.load()

        # Retrieve telemetry data for driver 'VER' (e.g., Max Verstappen)
        telemetry = session.laps.pick_driver('VER').get_telemetry()

        # Check if we have any telemetry data
        if telemetry.empty:
            return jsonify({"error": "No telemetry data available for the selected driver."}), 404

        # Convert time to total seconds
        telemetry['Seconds'] = telemetry['Time'].dt.total_seconds().astype(int)
        # Remove duplicate rows for the same second
        telemetry = telemetry.drop_duplicates(subset='Seconds', keep='first')

        # Prepare data for JSON response
        labels = telemetry['Seconds'].tolist()
        values = telemetry['Speed'].tolist()

        telemetry_data = {
            "labels": labels,
            "values": values
        }

        # Return the data as JSON
        return jsonify(telemetry_data)

    except Exception as e:
        # If there's an error, return an error message with status 500
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    # Run the Flask app
    # Use host='0.0.0.0' to allow external access if needed
    app.run(debug=True, host='0.0.0.0', port=8000)
