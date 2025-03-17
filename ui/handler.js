const pressHistory = []

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

var visualizerBars = []
const visualizerBarOwnership = {}
function createKey(keyName) {
    const lane = document.createElement("span")
    const key = document.createElement("span")
    const counter = document.createElement("span")
    const visualizer = document.createElement("span")



    lane.classList.add("lane")
    key.classList.add("key")
    counter.classList.add("counter")
    visualizer.classList.add("visualizer")

    lane.appendChild(key)
    lane.appendChild(counter)
    lane.appendChild(visualizer)

    key.innerText = keyName
    counter.innerText = 0

    document.querySelector(".key-container").appendChild(lane)

    return (down) => {
        const bar = visualizerBarOwnership[keyName]
        if (!down&&lane.classList.contains("down")) {
            lane.classList.toggle("down",false)
            if (bar) {
                visualizerBars.push([Date.now(),bar[1]])
                visualizerBarOwnership[keyName] = null
            }
        } else if (down&&!lane.classList.contains("down")) {
            lane.classList.toggle("down",true)
            counter.innerText = Number(counter.innerText) + 1
            pressHistory.push(Date.now())
            
            if (bar) {
                bar[1].remove()
            }
            const newBar = document.createElement("span")
            newBar.classList.add("visualizer-bar")
            visualizer.appendChild(newBar)
            visualizerBarOwnership[keyName] = [Date.now(),newBar]
        }
    }
}

const keybinds = decodeHtml(keys).split("")
const hookedKeys = {}

keybinds.forEach(key => {
    hookedKeys[key] = createKey(key)
    visualizerBarOwnership[key] = null
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
    for (let i = 0; i < remove; i++) {
        pressHistory.shift()
    }
    kps = Math.round(pressHistory.length/kpsSmoothingFactor)
    kpsLabel.innerText = kps + "kps / " + maxKps + " max"

    if (kps > maxKps) {
        maxKps = kps
    }

    visualizerBars.forEach(data => {
        const time = data[0]
        const element = data[1]
        if (element.style) {
            const res = (((Date.now()-time)/100))*visualizer_speed
            element.style.bottom = res + "px"

            if (res > window.outerHeight) {
                element.remove()
                visualizerBars = visualizerBars.filter(f => f != data)
            }
        }
    });

    keybinds.forEach(key => {
        const owned = visualizerBarOwnership[key]
        if (owned) {
            const time = owned[0]
            const element = owned[1]
            element.style.height = (((Date.now()-time)/100)*visualizer_speed) + "px"
        }
    });

    requestAnimationFrame(kpsCalculator)
}

var socket = io("http://127.0.0.1:6727")
socket.on("keys",function(data) {
    Object.keys(data["keys"]).forEach((key)=>{
        hookedKeys[key](data["keys"][key])
    })
})

requestAnimationFrame(kpsCalculator)
