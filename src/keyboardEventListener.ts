import type {ComposeKey, Key} from './type';

enum EventStatus {
    Active,
    Inactive,
}

class KeyboardEventListener {
    private readonly receiver: HTMLDivElement;
    private readonly container: HTMLElement;
    private readonly eventListenerMap: Map<string, (e: KeyboardEvent) => void>;
    private eventStatus: EventStatus;

    constructor(container: HTMLElement, receiver?: HTMLDivElement) {
        this.container = container;
        this.receiver = receiver ?? this.createReceiver();
        this.eventListenerMap = new Map();
        this.eventStatus = EventStatus.Inactive;
    }

    eventListenerActive() {
        this.receiver.focus();

        this.eventStatus = EventStatus.Active;
    }

    eventListenerInactive() {
        this.receiver.blur();

        this.eventStatus = EventStatus.Inactive;
    }

    bindKey(key: ComposeKey<Key>, callback: (e: KeyboardEvent) => void) {
        const eventHandler = (e: KeyboardEvent) => {
            if (this.eventStatus === EventStatus.Active) {
                if (key.toLowerCase() === this.getKeyBoardEventCustomKey(e)) {
                    e.stopPropagation();
                    e.preventDefault();
                    callback(e);
                }
            }
        };

        // this.receiver.onkeydown = eventHandler;
        this.receiver.onkeyup = eventHandler;
        this.registerKeyCaller(key.toLowerCase(), callback);
    }

    dispatch(e: KeyboardEvent) {
        const key = this.getKeyBoardEventCustomKey(e);

        // 组合健
        if (e.isComposing) {
            return true;
        }

        if (this.eventListenerMap.has(key)) {
            e.stopPropagation();
            e.preventDefault();

            const result = this.eventListenerMap.get(key)?.(e);

            // 一定有一个返回值，确保告知 dispatch 执行成功
            return result ?? true;
        }
    }

    // 获取
    private getKeyBoardEventCustomKey(e: KeyboardEvent) {
        if (!e.composed) {
            return e.code.toLowerCase();
        }
        // 组合按钮
        let customKey = '';
        for (const key in e) {
            if (['ctrlKey', 'metaKey', 'altKey', 'shiftKey'].includes(key) && e[key as keyof KeyboardEvent]) {
                customKey = key.substring(0, key.length - 3) + '+';
                break;
            }
        }

        // 数字前缀 Digit
        if (e.code.startsWith('Digit')) {
            customKey += e.code[5];
        }
        // 字母前缀 Key
        else if (e.code.startsWith('Key')) {
            customKey += e.code[3];
        }
        else {
            customKey += e.code;
        }

        return customKey.toLowerCase();
    }

    private registerKeyCaller(key: string, callback: (e: KeyboardEvent) => void) {
        this.eventListenerMap.set(key, callback);
    }

    private createReceiver() {
        const containerReceiver = this.container.querySelector('.quick-click-menu-receiver');
        if (containerReceiver) {
            return containerReceiver as HTMLInputElement;
        }

        const receiver = document.createElement('div');
        receiver.className = 'quick-click-menu-receiver';
        receiver.setAttribute('contentEditable', 'true');
        // 增加tabindex属性使得 receiver 的contenteditable不管是trur还是false都能有focus和blur事件
        receiver.setAttribute('tabindex', '-1');

        this.container.appendChild(receiver);

        receiver.onfocus = () => {
            this.eventListenerActive();
        };

        receiver.onblur = () => {
            this.eventListenerInactive();
        };

        return receiver;
    }

}

export default KeyboardEventListener;
