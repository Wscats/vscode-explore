/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

import Contributes from './contributes';
import toolbarJson from './toolbar.json';
import sheetbarJson from './sheetbar.json';

// 获取 JSON 文件的配置信息，并配置到 configMap 中
Contributes.setContribute({
    name: 'toolbar',
    json: toolbarJson,
    // 局部作用域
    contextOptions: {
        'isMore': true,
        'platform': 'pc',
        'window.innerWidth': window.innerWidth,
        'SpreadsheetApp.sheetStatus.rangesStatus.status.canEdit': true,
    }
});

Contributes.setContribute({
    name: 'sheetbar',
    json: sheetbarJson,
    // 局部作用域
    contextOptions: {
        'platform': 'pc',
        'window.innerWidth': window.innerWidth,
        'SpreadsheetApp.sheetStatus.rangesStatus.status.canEdit': true,
        1: 1
    }
});

function renderToolbar() {
    Contributes.getContribute('toolbar')?.map((toolbar: any) => {
        if (toolbar.when) {
            const li = document.createElement('li');
            li.innerHTML = toolbar.component;
            document.querySelector('#toolbars')?.appendChild(li);
        }
    })
}

function renderSheetbar() {
    Contributes.getContribute('sheetbar')?.map((toolbar: any) => {
        if (toolbar.when) {
            const li = document.createElement('li');
            li.innerHTML = toolbar.component;
            document.querySelector('#sheetbars')?.appendChild(li);
        }
    })
}

function renderUpdateButton() {
    const button = document.createElement('button');
    button.innerHTML = "更改局部作用域，重新配置 toolbar";
    button.onclick = () => {
        let lis = document.querySelectorAll('#toolbars li');
        for (let i = 0; i < lis.length; i++) {
            lis[i].remove();
        }
        Contributes.updateContribute({
            name: 'toolbar',
            contextOptions: {
                'isMore': false,
                'window.innerWidth': window.innerWidth,
            }
        })
        renderToolbar();
    };
    document.body.appendChild(button);
}

renderToolbar();
renderSheetbar();
renderUpdateButton();

console.log(Contributes);