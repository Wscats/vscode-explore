/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

export class Config {
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