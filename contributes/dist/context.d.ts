/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
declare class Context {
    private readonly _values;
    getValue(key: string): any;
    setValue(key: string, value: any): void;
}
declare const context: Context;
export default context;
