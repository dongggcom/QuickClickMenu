// 键盘事件
const keymapUpperCase = {

    'Shift': 16,
    'Control': 17,
    'Alt': 18,
    'CapsLock': 20,

    'BackSpace': 8,
    'Tab': 9,
    'Enter': 13,
    'Esc': 27,
    'Space': 32,

    'PageUp': 33,
    'PageDown': 34,
    'End': 35,
    'Home': 36,

    'Insert': 45,

    'Left': 37,
    'Up': 38,
    'Right': 39,
    'Down': 40,

    'Direction': {
        37: 1,
        38: 1,
        39: 1,
        40: 1,
    },

    'Delete': 46,

    'NumLock': 144,

    'Cmd': 91,
    'CmdFF': 224,
    'F1': 112,
    'F2': 113,
    'F3': 114,
    'F4': 115,
    'F5': 116,
    'F6': 117,
    'F7': 118,
    'F8': 119,
    'F9': 120,
    'F10': 121,
    'F11': 122,
    'F12': 123,

    '`': 192,
    '=': 187,
    '-': 189,

    '/': 191,
    '.': 190,
};

// letter 'a'
const firstLetterAKeyCode = 65;
const firstLetterACharCode = 'a'.charCodeAt(0);

// number '9'
const numberNineKeyCode = 57;

type SplitLetter<T extends string> = T extends `${infer First}${infer Rest}`
    ? Rest extends '' ? First : First | SplitLetter<Rest>
    : T;

const KeyMap = {
    ...keymapUpperCase,

    // lowerCase
    ...Object.keys(keymapUpperCase).reduce((prev, key) => {
        prev[key.toLowerCase()] = keymapUpperCase[key as keyof typeof keymapUpperCase];
        return prev;
    }, {} as Record<string, number | Record<string, number>>),

    // letters
    ...('abcdefghijklmnopqrstuvwxyz'.split('') as Array<SplitLetter<'abcdefghijklmnopqrstuvwxyz'>>)
        .reduce((prev, letter) => {
            const charCode = letter.charCodeAt(0);
            prev[letter] = firstLetterAKeyCode + (charCode - firstLetterACharCode);
            return prev;
        }, {} as Record<SplitLetter<'abcdefghijklmnopqrstuvwxyz'>, number>),

    // numbers
    ...('0123456789'.split('') as Array<SplitLetter<'0123456789'>>).reduce((prev, number) => {
        prev[number] = numberNineKeyCode + (parseInt(number, 10) - 9);
        return prev;
    }, {} as Record<SplitLetter<'0123456789'>, number>),
};

export default KeyMap;
