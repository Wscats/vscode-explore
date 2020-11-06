/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

class Context {
    private readonly _values = new Map<string, any>();
    getValue(key: string): any {
        if (this._values.has(key)) {
            return this._values.get(key);
        }
    }
    setValue(key: string, value: any) {
        this._values.set(key, value);
    }
}

const context = new Context();

context.setValue('platform', 'pc');
context.setValue('scmProvider', 'git');
context.setValue('scmResourceGroup', 'merge');
context.setValue('window.innerWidth', window.innerWidth);
context.setValue('SpreadsheetApp.sheetStatus.rangesStatus.status.canEdit', true);

export default context;