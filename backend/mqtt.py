import paho.mqtt.client as mqtt
import csv
import os
import datetime
from pytz import timezone
from main import socketio

MQTT_SERVER = "localhost"
MQTT_FIELDS = ["temperature", "humidity", "VOC", "CO2"]
fields = MQTT_FIELDS.copy()
fields.append("time")
filename = "sensordata.csv"
sensorqueue = []
sensorqueuelist = {}
sensorqueuechange = {}

for i in MQTT_FIELDS:
    sensorqueuelist[i] = None
    sensorqueuechange[i] = 0


def new_row():
    dicta = {}
    for i in MQTT_FIELDS:
        dicta[i] = ""
    sensorqueue.append(dicta)

def reset_change():
    for i in sensorqueuechange:
        sensorqueuechange[i] = 0

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))

    for i in range(len(MQTT_FIELDS)):
        client.subscribe("esp32/" + MQTT_FIELDS[i])


def on_message(client, userdata, msg):
    print(msg.topic + " " + msg.payload.decode('ascii'))
    sensorqueuelist[msg.topic.replace("esp32/", "")] = msg.payload.decode('ascii')
    sensorqueuechange[msg.topic.replace("esp32/", "")] = 1
    if all(value == 1 for value in sensorqueuechange.values()):
        print("Sending Row: ")
        dictionary = {}
        for key in MQTT_FIELDS:
            dictionary[key] = sensorqueuelist[key]

        utc_now = datetime.datetime.utcnow()
        dictionary["time"] = utc_now.astimezone(timezone('US/Eastern')).strftime('%Y-%m-%d %H:%M:%S')
        
        socketio.emit("sensor_data", {
            "temperature": dictionary.temperature,
            "co2": dictionary.CO2,
            "humidity": dictionary.humidity,
            "voc": dictionary.VO2,
            "occupancy": 1
        })
        reset_change()


isExist = os.path.exists(filename)

if not isExist:
    new_row()
    with open(filename, "w") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fields)
        writer.writeheader()
    csvfile.close()

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
client.on_connect = on_connect
client.on_message = on_message
client.connect(MQTT_SERVER, 1883, 60)

client.loop_forever()
