function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

function fixName(n) {
    return toTitleCase(n.replaceAll("_"," "))
}

var settings = JSON.parse(decodeHtml(initial_settings))

Object.keys(settings).forEach((name)=>{
    if (!name.startsWith("$")) {
        createCategory(fixName(name),(cat)=>{
            Object.keys(settings[name]).forEach((setting)=>{
                const value = settings[name][setting]

                const updFunc = (v)=>{
                    if (setting == "keys") {
                        settings[name][setting] = v.toUpperCase()
                    } else {
                        settings[name][setting] = v
                    }
                }

                switch (typeof(value)) {
                    case "boolean":
                        createBoolValue(cat,fixName(setting),value, updFunc)
                        break;

                    case "string":
                        if (name == "colors") {
                            createColorValue(cat,fixName(setting),value, updFunc)

                        } else {
                            createTextValue(cat,fixName(setting),value, updFunc)
                        }
                        break;
                
                    default:
                        break;
                }
            })
        })
    }
})

document.querySelector(".save").addEventListener("click",()=>{
    fetch("/update_settings/",{
        method: "POST",
        body: JSON.stringify(settings)
    })
})
document.querySelector(".overlay").addEventListener("click",()=>{
    window.open("/overlay/")
})