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
                if (key === e.code.toLowerCase()) {
                    e.stopPropagation();
                    e.preventDefault();
                    callback(e);
                }
                // TODO: 组合键
            }
        };

        // this.receiver.onkeydown = eventHandler;
        this.receiver.onkeyup = eventHandler;
        this.registerKeyCaller(key, callback);
    }

    dispatch(key: string, e: KeyboardEvent) {
        if (this.eventListenerMap.has(key)) {
            const result = this.eventListenerMap.get(key)?.(e);

            // 一定有一个返回值，确保告知 dispatch 执行成功
            return result ?? true;
        }
    }

    private registerKeyCaller(key: ComposeKey<Key>, callback: (e: KeyboardEvent) => void) {
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
