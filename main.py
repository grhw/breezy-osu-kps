import json
import webbrowser
from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO
import pynput
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

server = Flask(__name__,template_folder="ui")
socket = SocketIO(server,cors_allowed_origins="*")

pressed_keys = {}

@server.route("/")
def send_ui():
    with open("config.json","r") as f:
        config = json.loads(f.read())
    for i in config["keys"]:
        pressed_keys[i.upper()] = False
    return render_template("index.html",
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

print("OBS Browser Source at https://127.0.0.1:6727")
print("Config at https://127.0.0.1:6727/options/")

webbrowser.open_new_tab("http://127.0.0.1:6727")
socket.run(server,port=6727,host="127.0.0.1")