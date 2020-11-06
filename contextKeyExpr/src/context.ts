/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

import { IContext } from './contextkey';

export class Context implements IContext {
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

export class Contexts implements IContext {
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