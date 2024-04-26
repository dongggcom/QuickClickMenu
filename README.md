# QuickClickMenu

A lightweight menu component without any external dependencies.

## Usage

To integrate QuickClickMenu into your project, you can use one of the following methods:

1. Install with npm:

```bash
npm install quick-click-menu
```

2. Import and use in your project:

```js
import QuickClickMenu from 'quick-click-menu';
import 'quick-click-menu/dist/style.css';

const options = {
    items: [
        {
            label: 'Add Node',
            click: () => {
                console.warn('Add Node');
            },
            key: 'tab',
            render: () => {
                const div = document.createElement('div');
                div.innerHTML = '<span>Add Node</span> <span style="color: grey">Tab</span>';
                return div;
            },
            children: [
                {
                    label: 'child1',
                    click: () => {
                        alert('child1 clicked');
                    },
                    key: 'ctrl+1'
                },
            ],
        },
        {
            label: 'Edit Node',
            click: () => {
                console.warn('Edit Node');
            },
            disabled: () => {
                const node = minder.getSelectedNode();
                return !node;
            },
            key: 'alt+1',
            render: '<span>Edit Node</span> <span style="color: grey">Space</span>',
        },
    ],
};

const qrm = new QuickClickMenu(options, document.body);

// located on container position
qrm.located({x: 0, y: 0});
```

## Example

Run `npm start` to start a local server.

Check more detail in [demo](https://github.com/dongggcom/quick-click-menu/example)