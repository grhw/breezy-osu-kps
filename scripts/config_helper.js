function createBoolValue(category, label, state, updFunc) {
    const container = category.querySelector(".config");
    const entry = document.createElement("span");
    entry.classList.add("entry","config_checkbox");

    const labelSpan = document.createElement("span");
    labelSpan.classList.add("label");
    labelSpan.textContent = label;

    const valueSpan = document.createElement("span");
    valueSpan.classList.add("value");

    const checkboxSpan = document.createElement("span");
    checkboxSpan.classList.add("checkbox");

    const innerSpan = document.createElement("span");
    innerSpan.classList.add("inner");

    const stateSpan = document.createElement("span");
    stateSpan.textContent = state ? "Enabled" : "Disabled";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state;

    checkboxSpan.appendChild(innerSpan);
    valueSpan.append(checkboxSpan, stateSpan, input);
    entry.append(labelSpan, valueSpan);
    container.appendChild(entry);

    input.addEventListener("change",()=>{
        stateSpan.textContent = input.checked ? "Enabled" : "Disabled";
        updFunc(input.checked)
    })

    return input
}

function createColorValue(category, label, color, updFunc) {
    const container = category.querySelector(".config");
    const entry = document.createElement("span");
    entry.classList.add("entry","config_color");

    const labelSpan = document.createElement("span");
    labelSpan.classList.add("label");
    labelSpan.textContent = label;

    const valueSpan = document.createElement("span");
    valueSpan.classList.add("value");

    const colorSpan = document.createElement("span");
    colorSpan.textContent = color;

    const input = document.createElement("input");
    input.type = "color";
    input.value = color;
    colorSpan.style.color = input.value

    valueSpan.appendChild(colorSpan);
    valueSpan.appendChild(input);
    entry.append(labelSpan, valueSpan);
    container.appendChild(entry);

    input.addEventListener("change",()=>{
        colorSpan.innerText = input.value
        colorSpan.style.color = input.value
        updFunc(input.value)
    })

    return input
}

function createTextValue(category, label, text, updFunc) {
    const container = category.querySelector(".config");
    const entry = document.createElement("span");
    entry.classList.add("entry","config_text");

    const labelSpan = document.createElement("span");
    labelSpan.classList.add("label");
    labelSpan.textContent = label;

    const valueSpan = document.createElement("span");
    valueSpan.classList.add("value");

    const input = document.createElement("input");
    input.type = "text";
    input.value = text;

    valueSpan.appendChild(input);
    entry.append(labelSpan, valueSpan);
    container.appendChild(entry);

    input.addEventListener("keyup",()=>{
        updFunc(input.value)
    })

    return input
}

function createCategory(name, func) {
    const container = document.createElement("div");
    container.classList.add("container")
    
    const title = document.createElement("span");
    title.classList.add("title")
    title.innerText = name

    const category = document.createElement("div");
    category.classList.add("category")

    const config = document.createElement("div");
    config.classList.add("config")
    
    container.appendChild(title)
    container.appendChild(category)

    category.appendChild(config)

    document.body.appendChild(container)

    return func(category)
}