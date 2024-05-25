import Render from './render';
import type {Options} from './type';
import './style.less';

class QuicClickMenu {
    readonly render: Render;
    private readonly options: Options;
    private readonly container: HTMLElement;

    constructor(options: Options, container: HTMLElement | string) {
        const defaultOptions: Options = {
            stopPropagation: true,
            items: [],
        };
        this.options = {...defaultOptions, ...options};

        const realContainer = container instanceof HTMLElement
            ? container
            : document.querySelector<HTMLElement>(container);

        if (!realContainer) {
            throw new Error('container must be a element');
        }

        this.container = realContainer;
        this.render = new Render(this.options.items, this.container);

        // 绑定键盘事件
        this.bindKeyboardEvent();
    }

    located({x, y}: {x?: number, y?: number}) {
        this.render.layout.style.left = `${x ?? this.container?.clientWidth / 2}px`;
        this.render.layout.style.top = `${y ?? this.container?.clientHeight / 2}px`;

        // 显示菜单
        this.render.show();
    }

    dispatch(e: KeyboardEvent) {
        return this.render.dispatch(e);
    }

    private bindKeyboardEvent() {
        this.container.onmousedown = e => {
            this.options.stopPropagation && e.preventDefault();

            this.render.registerEventListener();
        };
    }
}

export default QuicClickMenu;
