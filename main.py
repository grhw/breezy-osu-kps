import json
from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO
import pynput

server = Flask(__name__,template_folder="ui")
socket = SocketIO(server,cors_allowed_origins="*")

pressed_keys = {}

@server.route("/")
def send_ui():
    with open("config.json","r") as f:
        config = json.loads(f.read())
    for i in config["keys"]:
        pressed_keys[i.upper()] = False
    return render_template("index.html",k=config["keys"] .upper())

@server.route("/assets/<file>")
def assets(file):
    return send_from_directory("ui/",file)

def update():
    socket.emit("keys",{
        "keys": pressed_keys
    })

def on_press(k):
    try:
        k.char
    except AttributeError:
        return
    key = str(k.char).upper()
    if key in pressed_keys.keys():
        pressed_keys[key] = True
        update()

def on_release(k):
    try:
        k.char
    except AttributeError:
        return
    key = str(k.char).upper()
    if key in pressed_keys.keys():
        pressed_keys[key] = False
        update()

listener = pynput.keyboard.Listener(
    on_press=on_press,
    on_release=on_release)
listener.start()

socket.run(server,port=6727)