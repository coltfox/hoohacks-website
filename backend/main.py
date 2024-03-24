from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from connect_mqtt import connect_mqtt
from sklearn.preprocessing import StandardScaler, RobustScaler
import tensorflow as tf
import numpy as np
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

occupancy_model = tf.keras.models.load_model(r'C:\Folders\Programming\hoohacks\website\backend\occupancymodel.keras')
OCCUPANCY_THRESHOLD = 0.5

start = time.time()
time_elapsed_axis_values = [0.0] * 6
temp_axis_values = [0.0] * 6

def rand_float():
    return round(100 * abs(np.random.normal()), 3)

def generate_sample_data():
    return {
        "temperature": rand_float(),
        "co2": rand_float(),
        "humidity": rand_float(),
        "voc": rand_float(),
        "occupancy": 1
    }

# def update_data():
#     threading.Timer(2, update_data).start()
#     sample_data = generate_sample_data()
#     socketio.emit("sensor_data", sample_data)
#     socketio.emit("occupancy", True)

# update_data()

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print("Connect event emitted")
    emit("connect", include_self=False, broadcast=True)

def handle_sensor_data(data):
    socketio.emit("sensor_data", {
        "temperature": data["temperature"],
        "co2": data["CO2"],
        "humidity": data["humidity"],
        "voc": data["VOC"]
    })

    stdnorm = StandardScaler()

    data = np.array([[data["temperature"], data["humidity"], data["CO2"]]])
    data = stdnorm.fit_transform(data)

    res = occupancy_model.predict(data, verbose=0)[0][0]
    occupancy = True if res > OCCUPANCY_THRESHOLD else False
    print(res)
    
    socketio.emit("occupancy", occupancy)

try:
    print("Connecting to mqtt...")
    connect_mqtt(handle_data=handle_sensor_data)
except Exception as e:
    print(f"Failed to connect to socket: {e}")

if __name__ == '__main__':
    socketio.run(app, debug=True, port=4003)

