const pressHistory = []

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function createKey(keyName) {
    const lane = document.createElement("span")
    const key = document.createElement("span")
    const counter = document.createElement("span")
    lane.classList.add("lane")
    key.classList.add("key")
    counter.classList.add("counter")

    lane.appendChild(key)
    lane.appendChild(counter)

    key.innerText = keyName
    counter.innerText = 0

    document.querySelector(".key-container").appendChild(lane)

    return (down) => {
        if (!down&&lane.classList.contains("down")) {
            lane.classList.toggle("down",false)
        } else if (down&&!lane.classList.contains("down")) {
            lane.classList.toggle("down",true)
            counter.innerText = Number(counter.innerText) + 1
            pressHistory.push(Date.now())
        }
    }
}

const keybinds = decodeHtml(keys).split("")
const hookedKeys = {}

keybinds.forEach(key => {
    hookedKeys[key] = createKey(key)
});
/*
document.addEventListener("keydown",(ev)=>{
    const pressedKey = ev.key.toUpperCase()
    if (hookedKeys[pressedKey]) {
        hookedKeys[pressedKey](true)
    }
})

document.addEventListener("keyup",(ev)=>{
    const pressedKey = ev.key.toUpperCase()
    if (hookedKeys[pressedKey]) {
        hookedKeys[pressedKey](false)
    }
})
*/

const kpsLabel = document.querySelector(".kps")
const kpsSmoothingFactor = 2
var maxKps = 0

function kpsCalculator() {
    remove = 0
    pressHistory.forEach((v)=>{
        if (Date.now()-v > 1000*kpsSmoothingFactor) {
            remove += 1
        }
    })
    pressHistory.reverse()
    for (let i = 0; i < remove; i++) {
        pressHistory.pop()
    }
    pressHistory.reverse()
    kps = Math.round(pressHistory.length/kpsSmoothingFactor)
    kpsLabel.innerText = kps + "kps / " + maxKps + " max"

    if (kps > maxKps) {
        maxKps = kps
    }

    requestAnimationFrame(kpsCalculator)
}

var socket = io("http://127.0.0.1:6727")
socket.on("keys",function(data) {
    Object.keys(data["keys"]).forEach((key)=>{
        hookedKeys[key](data["keys"][key])
    })
})

requestAnimationFrame(kpsCalculator)
