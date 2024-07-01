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

    located({x = 0, y = 0}: {x?: number, y?: number}) {
        // 显示菜单
        this.render.show();
        // clientSize 需要 render 后
        const {offsetX, offsetY} = this.render.boundaryHint({x: x ?? 0, y: y ?? 0});

        this.render.located({x: x + offsetX, y: y + offsetY});
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
