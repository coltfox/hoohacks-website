from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import random
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# def send_counter():
#     threading.Timer(2, send_counter).start()
#     print("send counter")
#     socketio.emit("counter", str(random.randint(0, 1000)))

# send_counter()

sample_data = {
    "room_name": "room",
    "bluetooth_address": 0,
    "temperature": 23.7,
    "light": 585.2,
    "co2": 749.2,
    "humidity": 26.272,
    "occupancy": 1
}

@socketio.on("counter")
def get_count():
    print("counter emitted")
    # emit("counter", str(random.randint(0, 1000)), broadcast=True)


@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print("Connect event emitted")
    emit("counter", sample_data, broadcast=True)


@socketio.on('data')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ", str(data))
    # emit("data", {'data': data, 'id': request.sid}, broadcast=True)


@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    # emit("disconnect", f"user {request.sid} disconnected", broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=4003)

