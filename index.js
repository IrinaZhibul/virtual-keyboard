import { keysEn } from "./keys-en.js";
import { keysBy } from "./keys-by.js";


let keys;
let isCapsLock = false;

const LEFT_SHIFT_KEY_CODE = "ShiftLeft";
const RIGHT_SHIFT_KEY_CODE = "ShiftRight";
const LEFT_CONTROL_KEY_CODE = "ControlLeft";
const RIGHT_CONTROL_KEY_CODE = "ControlRight";
let currentLanguage;

initKeys();

const container = document.createElement('div');
container.classList = 'container';
const textarea = document.createElement('textarea');
textarea.classList = 'textarea';
document.body.appendChild(container);
container.appendChild(textarea);

let buttons = keys.map((key) => {
    const button = document.createElement('button');
    button.classList = "btn";
    button.style.width = key.width || '50px';
    button.setAttribute('code', key.code)
    button.textContent = key.mainKey;
    container.appendChild(button);
    return button;
});


document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && (event.code === LEFT_SHIFT_KEY_CODE || event.code === LEFT_CONTROL_KEY_CODE)) {
        changeLanguage();
        return;
    }

    if (event.code != "ArrowUp" && event.code != "ArrowDown" && event.code != "ArrowLeft" && event.code != "ArrowRight") {
        event.preventDefault();
    }
    const keyObj = keys.find(x => x.code.toLowerCase() == event.code.toLowerCase());
    console.log(keyObj)
    if (keyObj) {
        handleKeyPress(keyObj);
    }
});


subscribeOnKeyClickEvent();




function initKeys() {
    let storedLang = sessionStorage.getItem('lang') || 'en';
    switch (storedLang) {
        case 'en': keys = keysEn; currentLanguage = 'en'; break;
        case 'by': keys = keysBy; currentLanguage = 'by'; break;
        default: keys = keysEn; sessionStorage.setItem('lang', 'en'); currentLanguage = 'en'; break;
    }
}

function changeLanguage() {
    if (currentLanguage === 'en') {
        currentLanguage = 'by';
        keys = keysBy;

    } else {
        currentLanguage = 'en';
        keys = keysEn;
    }
    sessionStorage.setItem('lang', currentLanguage)

    if (buttons) {
        buttons.forEach((button, index) => {
            button.textContent = keys[index].mainKey;
        });
    }
}

function handleKeyPress(key) {
    const ingoredKeys = [LEFT_SHIFT_KEY_CODE, RIGHT_SHIFT_KEY_CODE, RIGHT_CONTROL_KEY_CODE, LEFT_CONTROL_KEY_CODE, 'AltRight', 'AltLeft', 'MetaLeft']
    if (ingoredKeys.includes(key.code)) {
        return;
    }
    if (key.code === 'Backspace') {
        textarea.value = textarea.value.slice(0, -1);
    } else if (key.code === 'Delete') {
        textarea.value = textarea.value.slice(1);
    }
    else if (key.code === 'ArrowDown') {
        moveCursorDown(textarea);
        textarea.focus();
    }
    else if (key.code === 'ArrowUp') {
        moveCursorUp(textarea);
        textarea.focus();
    } 
    else if (key.code === 'ArrowLeft') {
        moveCursorLeft(textarea);
        textarea.focus();
    } 
    else if (key.code === 'ArrowRight') {
        moveCursorRight(textarea);
        textarea.focus();
    }     
    else if (key.code === 'Tab') {
        textarea.value += '\t';

    } else if (key.code === 'Enter') {
        textarea.value += '\n';
    } else if (key.code === 'Space') {
        textarea.value += ' ';
    } else if (key.code === 'CapsLock') {
        toggleCapsLock();
    } else {
        textarea.value += isCapsLock ? key.mainKey.toUpperCase() : key.mainKey;
        textarea.focus();
    }
}
function moveCursorDown(element) {
    const currentPosition = element.selectionStart;
    const lineBreakIndex = element.value.indexOf('\n', currentPosition);
    if (lineBreakIndex === -1) {
        element.selectionStart = element.selectionEnd = element.value.length;
    
    } else {
        element.selectionStart = element.selectionEnd = lineBreakIndex + 1;
    }
}

function moveCursorLeft(element) {
    const currentPosition = element.selectionStart;
    element.selectionStart = element.selectionEnd = currentPosition - 1;
  }
  function moveCursorRight(element) {
    const currentPosition = element.selectionStart;
    element.selectionStart = element.selectionEnd = currentPosition + 1;
  }


function moveCursorUp(element) {
    const currentPosition = element.selectionStart;
    const lineBreakIndex = element.value.lastIndexOf('\n', currentPosition - 1);
    if (lineBreakIndex === -1) {
      element.selectionStart = element.selectionEnd = 0;
    } else {
      element.selectionStart = element.selectionEnd = lineBreakIndex + 1;
    }
  }

function subscribeOnKeyClickEvent() {
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const keyObj = keys.find(x => x.code.toLowerCase() == event.target.getAttribute('code').toLowerCase());
            handleKeyPress(keyObj);
        });
    });
}


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