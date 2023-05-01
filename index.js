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
const text1 = document.createElement('p');
text1.classList = 'text';
document.body.appendChild(text1);
text1.textContent = 'Клавиатура создана в операционной системе Windows';
const text2 = document.createElement('p');
text2.classList = 'text';
document.body.appendChild(text2);
text2.textContent = 'Для переключения языка комбинация: левыe shift + ctrl';


let buttons = keys.map((key) => {
    const button = document.createElement('button');
    button.classList = "btn";
    button.style.width = key.width || '50px';
    button.setAttribute('code', key.code)
    button.textContent = key.mainKey;
    container.appendChild(button);
    return button;
});

function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Zа-яА-ЯЁёіІўЎ]/i);
  }

document.addEventListener('keydown', (event) => {
    if (event.code == LEFT_SHIFT_KEY_CODE || event.code == RIGHT_SHIFT_KEY_CODE) {
        buttons.forEach((btn) => {
            let foundedKey = keys.find(x=>x.code == btn.getAttribute('code'))
            if(foundedKey){
                if (foundedKey.subKey) {
                    btn.textContent = foundedKey.subKey
                } else if (isLetter(foundedKey.mainKey)){
                    btn.textContent = isCapsLock  ? foundedKey.mainKey.toLowerCase() : foundedKey.mainKey.toUpperCase(); 
                }
            }
        })
    }
    const selectionStart = event.target.selectionStart;
    const selectionEnd = event.target.selectionEnd;
    console.log('Cursor position changed:', selectionStart, selectionEnd);
    console.log('keydown')
    let btns = document.querySelectorAll('button');
    let pressedBtn = Array.from(btns).find(btn => btn.getAttribute('code') == event.code);
    pressedBtn.classList.add('pressed');
    if (event.ctrlKey && event.shiftKey && (event.code === LEFT_SHIFT_KEY_CODE || event.code === LEFT_CONTROL_KEY_CODE)) {
        changeLanguage();
        return;
    }

     event.preventDefault();
    const keyObj = Array.from(buttons).find(x => x.getAttribute('code').toLowerCase() == event.code.toLowerCase());
    console.log(keyObj)
    if (keyObj) {
        handleKeyPress(keyObj);
    }
});

document.addEventListener('keyup', (event) => {
    console.log('keyup')
    if (event.code == LEFT_SHIFT_KEY_CODE || event.code == RIGHT_SHIFT_KEY_CODE) {
        buttons.forEach((btn) => {
            let foundedKey = keys.find(x=>x.code == btn.getAttribute('code'))
            if(foundedKey){
                if (foundedKey.subKey) {
                    btn.textContent = foundedKey.mainKey;
                } else if (isLetter(foundedKey.mainKey)){
                    btn.textContent = isCapsLock  ? foundedKey.mainKey.toUpperCase() : foundedKey.mainKey.toLowerCase(); 
                }
            }
        })
    }
    let btns = document.querySelectorAll('button');
    let pressedBtn = Array.from(btns).find(btn => btn.getAttribute('code') == event.code);
    pressedBtn.classList.remove('pressed');
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
            if (isCaseSensetive(keys[index])) {
                button.textContent = isCapsLock ? keys[index].mainKey.toUpperCase() : keys[index].mainKey;
            }
        });
    }
}

function handleKeyPress(key) {
    let code = key.getAttribute('code');
    let mainKey = key.textContent;
    const ingoredKeys = [LEFT_SHIFT_KEY_CODE, RIGHT_SHIFT_KEY_CODE, RIGHT_CONTROL_KEY_CODE, LEFT_CONTROL_KEY_CODE, 'AltRight', 'AltLeft', 'MetaLeft']
    if (ingoredKeys.includes(code)) {
        return;
    }
    if (code === 'Backspace') {
        let pos = textarea.selectionStart;
        let result = textarea.value.slice(0, textarea.selectionStart - 1) + textarea.value.slice(textarea.selectionStart);
        textarea.value =  result;
        textarea.selectionStart = pos - 1;
        textarea.selectionEnd = pos - 1;
    } else if (code === 'Delete') {
        let pos = textarea.selectionStart;
        let result = textarea.value.slice(0, textarea.selectionStart) + textarea.value.slice(textarea.selectionStart + 1);
        textarea.value =  result;
        textarea.selectionStart = pos;
        textarea.selectionEnd = pos;
    }
    else if (code === 'Tab') {
        addSymbolsAtPosition('\t', textarea);
    } else if (code === 'Enter') {
        addSymbolsAtPosition('\n', textarea);
    } else if (code === 'Space') {
        addSymbolsAtPosition(' ', textarea)
    } else if (code === 'CapsLock') {
        toggleCapsLock();
    } else {
        addSymbolsAtPosition(mainKey, textarea);
        textarea.focus();
    }
}

function addSymbolsAtPosition(symbols, textarea) {
    let pos = textarea.selectionStart;
    let result = textarea.value.slice(0, textarea.selectionStart) + symbols + textarea.value.slice(textarea.selectionStart);
    textarea.value = result;
    textarea.selectionStart = pos + symbols.length;
    textarea.selectionEnd = pos + symbols.length;
}

function subscribeOnKeyClickEvent() {
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const keyObj = Array.from(buttons).find(x => x.getAttribute('code').toLowerCase() == event.target.getAttribute('code').toLowerCase());
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