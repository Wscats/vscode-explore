/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { Context, Contexts } from './context';
import { Config } from './config';
interface IContextOptions {
    [key: string]: string | number | boolean;
}
declare const _default: {
    readonly _config: Config;
    readonly _contexts: Contexts;
    _cloneContribute(confg: Config): any;
    getContribute(name: string): any;
    updateContribute({ name, contextOptions }: {
        name: string;
        contextOptions: IContextOptions;
    }): any;
    _updateContexts({ name, contextOptions }: {
        name: string;
        contextOptions: IContextOptions;
    }): void;
    setContribute({ name, json, contextOptions }: {
        name: string;
        json: any;
        contextOptions: IContextOptions;
    }): void;
    _iterateContribute(obj: any, context: Context): void;
};
export default _default;
