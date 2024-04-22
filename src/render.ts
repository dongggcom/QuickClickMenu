import KeyboardEventListener from './keyboardEventListener';
import type {ComposeKey, Key, Options} from './type';

class Render {
    readonly layout: HTMLDivElement;
    private readonly eventListener: KeyboardEventListener;
    private readonly container: HTMLElement;
    private readonly items: Options['items'];

    constructor(items: Options['items'], container?: HTMLElement) {
        this.items = items;
        this.layout = document.querySelector('.quick-click-menu-layout') ?? this.createLayout();
        this.container = container ?? document.body;

        // 事件监听
        this.eventListener = new KeyboardEventListener(this.layout);

        // 渲染菜单
        this.renderMenu();
    }

    show() {
        // 显示菜单
        this.layout.classList.remove('hide');

        // refresh layout
        const oldLayoutDom = document.querySelector('.quick-click-menu-layout');
        if (oldLayoutDom) {
            this.container.replaceChild(this.layout, oldLayoutDom);
        } else {
            this.container.appendChild(this.layout);
        }
        
        // 如果有菜单，则添加到 body 中
        if (this.layout.parentNode) {
            this.renderMenu();
        }
    }

    hide() {
        // 隐藏菜单
        this.layout.classList.add('hide');
    }

    registerEventListener() {
        this.eventListener.eventListenerActive();
    }

    dispatch(e: KeyboardEvent) {
        return this.eventListener.dispatch(e);
    }

    // 渲染菜单
    private renderMenu() {
        this.layout.querySelector('.quick-click-menu')?.remove();
        this.layout.appendChild(this.createMenu(this.items));
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
            else {
                li.innerText = item.label;
            }

            // 快捷键
            if (item.key) {
                if (Array.isArray(item.key)) {
                    item.key.forEach(k => {
                        this.eventListener.bindKey(k as ComposeKey<Key>, () => {
                            !item.disabled?.() && item.click();
                        });
                    });
                } else {
                    this.eventListener.bindKey(item.key as ComposeKey<Key>, () => {
                        !item.disabled?.() && item.click();
                    });
                }
            }

            // 禁用
            if (item.disabled?.()) {
                li.classList.add('disabled');
            }

            // 添加事件
            (li.onclick = e => {
                e.stopPropagation();
                if (item.disabled?.()) {
                    return;
                }

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
