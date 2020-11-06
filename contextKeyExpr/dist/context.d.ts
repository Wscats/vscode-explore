/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { IContext } from './contextkey';
export declare class Context implements IContext {
    private readonly _values;
    getValue(key: string): any;
    setValue(key: string, value: any): void;
}
export declare class Contexts implements IContext {
    private readonly _values;
    getValue(key: string): any;
    setValue(key: string, value: any): void;
}
