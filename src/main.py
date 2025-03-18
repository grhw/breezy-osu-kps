import json
import webbrowser
from flask import Flask, render_template, send_from_directory
import flask
from flask_socketio import SocketIO
import pynput
import logging
import os

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

server = Flask(__name__,template_folder="_internal/ui")
socket = SocketIO(server,cors_allowed_origins="*")

pressed_keys = {}

@server.route("/overlay/")
def send_overlay():
    global pressed_keys
    pressed_keys = {}
    with open("config.json","r") as f:
        config = json.loads(f.read())
    for i in config["key_overlay"]["keys"]:
        pressed_keys[i.upper()] = False
    return render_template("overlay.html",
                        v="y" if config["key_overlay"]["visualizer_enabled"] else "",
                        vs=config["key_overlay"]["visualizer_speed"],
                        k=config["key_overlay"]["keys"].upper(),
                        
                        text_color=config["colors"]["text_color"],
                        active_text_color=config["colors"]["active_text_color"],
                        background_color=config["colors"]["background_color"],
                        key_background_color=config["colors"]["key_background_color"],
                        key_shadow_color=config["colors"]["key_shadow_color"],
                        visualizer_color=config["colors"]["visualizer_color"]
                        )

@server.route("/")
def send_options():
    with open("config.json","r") as f:
        config = json.loads(f.read())
    return render_template("options.html",config=json.dumps(config))

@server.post("/update_settings/")
def update_settings():
    with open("config.json","w+") as f:
        f.write(json.dumps(json.loads(flask.request.get_data(as_text=True)),indent=4))
    
    return "ok"

@server.route("/scripts/<file>")
def send_script(file):
    return send_from_directory("_internal/scripts/",file)

@server.route("/styles/<file>")
def send_style(file):
    return send_from_directory("_internal/styles/",file)

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

print("OBS Browser Source at https://127.0.0.1:6727")
print("Config at https://127.0.0.1:6727/options/")

webbrowser.open_new_tab("http://127.0.0.1:6727")
socket.run(server,port=6727,host="127.0.0.1")