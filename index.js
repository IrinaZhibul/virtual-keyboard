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


function handleKeyPress(key) {
    if (key.mainKey === 'Backspace') {
        textarea.value = textarea.value.slice(0, -1);
    } else if (key.mainKey === 'Space') {
        textarea.value += ' ';
    } else if (key.mainKey === 'Caps Lock') {
        toggleCapsLock();
    } else {
        textarea.value += isCapsLock ? key.mainKey.toUpperCase() : key.mainKey;
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (keys.includes(key)) {
        event.preventDefault();
        handleKeyPress(key);
    }
});

const buttons = keys.map((key) => {
    const button = document.createElement('button');
    button.classList = "btn";
    button.textContent = key.mainKey.toLowerCase();
    button.addEventListener('click', () => handleKeyPress(key));
    container.appendChild(button);
    return button;
});