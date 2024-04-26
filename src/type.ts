import KeyMap from './dict/keymap';

// 例如 Alt+1 快捷键
export type Key = keyof typeof KeyMap;
export type ComposeKey<T extends Key> = T | `${T}+${T}`;

export interface OptionItem {
    label: string;
    click?: () => void;
    disabled?: () => boolean | boolean;
    key?: string | string[];
    // TODO: react / vue / html / string / function
    render?: (() => HTMLElement) | HTMLElement | string;
    children?: OptionItem[];
}

export interface Options {
    // 菜单项
    items: OptionItem[];
}
