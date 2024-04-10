import KeyMap from './dict/keymap';
import KeyboardEventListener from './keyboardEventListener';
import type {ComposeKey, Key, Options} from './type';

class Render {
    readonly layout: HTMLDivElement;
    private readonly eventListener: KeyboardEventListener;
    private readonly container: HTMLElement;

    constructor(items: Options['items'], container?: HTMLElement) {
        this.layout = document.querySelector('.quick-click-menu-layout') ?? this.createLayout();
        this.container = container ?? document.body;

        // 事件监听
        this.eventListener = new KeyboardEventListener(this.layout);

        // 创建菜单
        this.layout.querySelector('.quick-click-menu')?.remove();
        this.layout.appendChild(this.createMenu(items));

    }

    show() {
        // 显示菜单
        this.layout.classList.remove('hide');

        // 如果有菜单，则添加到 body 中
        if (this.layout.parentNode) {
            return;
        }

        this.container.appendChild(this.layout);
    }

    hide() {
        // 隐藏菜单
        this.layout.classList.add('hide');
    }

    registerEventListenr() {
        this.eventListener.eventListenerActive();
    }

    dispatch(key: string, e: KeyboardEvent) {
        return this.eventListener.dispatch(key, e);
    }

    // 创建布局
    private createLayout() {
        const layout = document.createElement('div');

        layout.className = 'quick-click-menu-layout hide';

        layout.onmousedown = e => {
            e.stopPropagation();
            e.preventDefault();
        };

        return layout;
    }

    // 创建菜单
    private createMenu(items: Options['items']) {
        const menu = document.createElement('ul');
        menu.className = 'quick-click-menu';

        // 创建菜单项
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.title = item.label;
            li.dataset['index'] = `${index}`;

            // 渲染
            if (typeof item.render === 'string') {
                li.innerHTML = item.render;
            }
            else if (item.render) {
                let child: Text | HTMLElement = document.createTextNode(item.label);
                if (item.render instanceof HTMLElement) {
                    child = item.render;
                }
                else if (typeof item.render === 'function') {
                    const renderContent = item.render();
                    if (renderContent instanceof HTMLElement) {
                        child = renderContent;
                    }
                }

                li.appendChild(child);
            }

            // 快捷键
            if (item.key && KeyMap[item.key as ComposeKey<Key>]) {
                this.eventListener.bindKey(item.key as ComposeKey<Key>, () => {
                    !item.disabled?.() && item.click();
                });
            }

            // 禁用
            if (item.disabled?.()) {
                li.classList.add('disabled');
            }

            // 添加事件
            !item.disabled?.() && (li.onclick = e => {
                e.stopPropagation();
                item.click();

                // 隐藏菜单
                this.hide();
            });

            menu.appendChild(li);
        });

        return menu;
    }

}

export default Render;
