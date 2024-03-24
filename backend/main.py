from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import threading
import numpy as np
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

start = time.time()
time_elapsed_axis_values = [0.0] * 6
temp_axis_values = [0.0] * 6

def rand_float():
    return round(100 * abs(np.random.normal()), 3)

def shift_all_to_the_left(array):
    for index, element in enumerate(array):
        if index == len(array)-1:
            continue
        array[index] = array[index+1]
    return array

def get_axis_values(new_value, old_list):
    new_list = shift_all_to_the_left(old_list)
    new_list[-1] = new_value
    
    return new_list

def generate_sample_data():
    time_elapsed = round(time.time() - start, 3)
    temp = rand_float()

    # time_elapsed_axis_values = get_axis_values(time_elapsed, time_elapsed_axis_values)
    # temp_axis_values = get_axis_values(temp, temp_axis_values)


    return {
        "room_name": "room",
        "bluetooth_address": 0,
        "temperature": temp,
        "light": rand_float(),
        "co2": rand_float(),
        "humidity": rand_float(),
        # "time_elapsed": time_elapsed_axis_values,
        # "temp_axis_values": temp_axis_values,
        "occupancy": 1
    }

def update_data():
    threading.Timer(2, update_data).start()
    sample_data = generate_sample_data()
    socketio.emit("sensor_data", sample_data)
    socketio.emit("occupancy", True)

update_data()

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print("Connect event emitted")
    emit("connect", include_self=False, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=4003)

