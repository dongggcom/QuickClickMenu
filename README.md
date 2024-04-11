# QuickClickMenu

## Usage

First copy `src` all files to your project.

Copy the following code to your project.

```js
import QuickClickMenu from '@/components/QuickClickMenu';

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