import KeyboardEventListener from './keyboardEventListener';
import type {ComposeKey, Key, OptionItem, Options} from './type';

class Render {
    children?: Render;
    parent?: Render;
    readonly layout: HTMLDivElement;
    private readonly className: string;
    private readonly eventListener: KeyboardEventListener;
    private readonly container: HTMLElement;
    private readonly items: Options['items'];

    constructor(items: Options['items'], container?: HTMLElement, className?: string) {
        this.items = items;
        this.className = className ?? 'quick-click-menu';
        this.layout = document.querySelector(`.${this.className}-layout`) ?? this.createLayout();
        this.container = container ?? document.body;

        // 事件监听
        this.eventListener = new KeyboardEventListener(this.layout);

        // 渲染菜单
        this.renderMenu();
    }

    // 显示菜单
    show() {
        this.layout.classList.remove('hide');

        const oldLayoutDom = document.querySelector(`.${this.className}-layout`);
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

    // 隐藏菜单
    hide() {
        this.layout.classList.add('hide');
        this.children?.layout.classList.add('hide');
        this.parent?.layout.classList.add('hide');

    }

    registerEventListener() {
        this.eventListener.eventListenerActive();
    }

    dispatch(e: KeyboardEvent) {
        return this.eventListener.dispatch(e);
    }

    // 渲染菜单
    private renderMenu() {
        this.layout.querySelector(`.${this.className}`)?.remove();
        this.layout.appendChild(this.createMenu(this.items));
    }

    // 创建布局
    private createLayout() {
        const layout = document.createElement('div');

        layout.className = `${this.className}-layout hide`;

        layout.onmousedown = e => {
            e.stopPropagation();
            e.preventDefault();
        };

        layout.addEventListener('mousewheel', e => {
            e.stopPropagation();
        }, false);

        return layout;
    }
    

    // 创建菜单
    private createMenu(items: Options['items']) {
        const menu = document.createElement('ul');
        menu.className = this.className;

        // 创建菜单项
        items.forEach((item, index) => {
            const li = this.createItem(item, index);
            menu.appendChild(li);
        });

        return menu;
    }

    // 创建菜单项
    private createItem(item: OptionItem, index?: number | string) {
        const li = document.createElement('li');
        li.title = item.label;
        li.dataset['index'] = `${index}`;

        // 渲染
        if (typeof item.render === 'string') {
            li.innerText = item.render;
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

        // 子节点
        if (item.children && item.children.length > 0) {
            const arrow = document.createElement('i');
            arrow.className = `${this.className}-arrow`;

            li.appendChild(arrow);

            const children = new Render(item.children, this.container, 'quick-click-sub-menu');

            // 父节点消失，通过绑定，使子节点消失
            this.children = children;
            // 子节点消失，通过绑定，使父节点消失
            this.children.parent = this;

            // hover 显示
            li.onmouseenter = () => {
                children.layout.style.left = `${this.layout.offsetLeft + this.layout.offsetWidth + 5}px`;
                children.layout.style.top = `${this.layout.offsetTop + li.offsetTop}px`;

                children.show();

                // 未 append body，因此更新子节点
                this.children = children;
            };

            // 子节点，隐藏
            children.layout.onmouseleave = () => {
                children.layout.classList.add('hide');
            };
        }

        // 快捷键
        if (item.key && item.click) {
            if (Array.isArray(item.key)) {
                item.key.forEach(k => {
                    this.eventListener.bindKey(k as ComposeKey<Key>, () => {
                        !item.disabled?.() && item.click?.();
                    });
                });
            } else {
                this.eventListener.bindKey(item.key as ComposeKey<Key>, () => {
                    !item.disabled?.() && item.click?.();
                });
            }
        }

        // 禁用
        if (item.disabled?.()) {
            li.classList.add('disabled');
        }

        // 添加事件
        item.click && (li.onclick = e => {
            e.stopPropagation();
            if (item.disabled?.()) {
                return;
            }

            item.click?.();

            // 隐藏菜单
            this.hide();
        });

        return li;
    }

}

export default Render;
