import { keysEn } from "./keys-en.js";
import { keysBy } from "./keys-by.js";

let currentLanguage = 'en';
let keys = keysEn;
let isCapsLock = false;

const container = document.createElement('div');
container.classList = 'container';
const textarea = document.createElement('textarea');
textarea.classList = 'textarea';
document.body.appendChild(container);
container.appendChild(textarea);

function switchLanguage() {
    if (currentLanguage === 'en') {
        currentLanguage = 'by';
        keys = keysBy;
    } else {
        currentLanguage = 'en';
        keys = keysEn;
    }

    buttons.forEach((button, index) => {
        button.textContent = keys[index];
    });
}

function handleKeyPress(key) {
    if (key.mainKey === 'Backspace') {
        textarea.value = textarea.value.slice(0, -1);
    } else if (key.mainKey === 'Del') {
        textarea.value = textarea.value.slice(1);
    } else if (key.mainKey === 'Tab') {
        textarea.value += '\t';
    } else if (key.mainKey === 'Enter') {
        textarea.value += '\n';
    } else if (key.mainKey === 'Space') {
        textarea.value += ' ';
    } else if (key.mainKey === 'Caps Lock') {
        toggleCapsLock();
    } else {
        textarea.value += isCapsLock ? key.mainKey.toUpperCase() : key.mainKey;
    }
}

document.addEventListener('keydown', (event) => {
    console.log(event)
    event.preventDefault();
    let keyMapped = event.key == ' ' ? 'Space' : event.key;
    const keyObj = keys.find(x => x.mainKey.replace(' ','').toLowerCase() == keyMapped.toLowerCase());
    console.log(keyObj)
    if (keyObj) {
        handleKeyPress(keyObj);
    }
});

const buttons = keys.map((key) => {
    const button = document.createElement('button');
    button.classList = "btn";
    button.textContent = key.mainKey;
    button.addEventListener('click', () => handleKeyPress(key));
    container.appendChild(button);
    return button;
});

function toggleCapsLock() {
    isCapsLock = !isCapsLock;
    buttons.forEach((button, index) => {
        if (isCaseSensetive(keys[index])) {
            button.textContent = isCapsLock ? keys[index].mainKey.toUpperCase() : keys[index].mainKey;
        }
    });
}
function isCaseSensetive(button) {
    let arr = [
        "Caps Lock",
        "Shift",
        "Enter",
        "Alt",
        "Ctrl",
        "Win",
        "Del",
        "Backspace",
        "Tab",
        "Space"
    ]
    return arr.includes(button.mainKey) ? false : true;
}
