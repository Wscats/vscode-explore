/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

import { ContextKeyExpr, contextMatchesRules } from './contextkey';
import { Context, Contexts } from './context';
import { Config } from './config';

interface IContextOptions { [key: string]: string | number | boolean }

export default new class Contributes {
    private readonly _config: Config;
    private readonly _contexts: Contexts;
    constructor() {
        // 缓存所有配置项
        this._config = new Config();
        // 缓存所有作用域
        this._contexts = new Contexts();
    }

    // 深度克隆配置项
    private _cloneContribute(confg: Config) {
        return JSON.parse(JSON.stringify(confg))
    }

    public getContribute(name: string) {
        // 获取缓存的配置并进行深拷贝
        const contributes = this._cloneContribute(this._config.getValue(name));
        // 遍历并解析整个 JSON 中的所有 when 属性
        this._iterateContribute(contributes, this._contexts.getValue(name));
        return contributes;
    }

    // 根据最新局部作用域，更新配置项
    public updateContribute({ name, contextOptions }: { name: string, contextOptions: IContextOptions }) {
        this._updateContexts({ name, contextOptions });
        return this.getContribute(name);
    }

    // 更新局部作用域
    private _updateContexts({ name, contextOptions }: { name: string, contextOptions: IContextOptions }) {
        // 每个配置项分配独立的作用域
        let context = new Context();
        Object.keys(contextOptions).map((contextOption) => {
            context.setValue(contextOption, contextOptions[contextOption]);
        })
        // 独立作用域放入一个总的作用域中管理
        this._contexts.setValue(name, context);
    }

    public setContribute({
        name,
        json,
        contextOptions
    }: {
        name: string,
        json: any,
        contextOptions: IContextOptions
    }) {
        // 获取 JSON 文件中的配置参数
        if (!json.contributes) return;
        const contributes = json.contributes;
        // 更新作用域
        this._updateContexts({ name, contextOptions });
        // 根据条件表达式规则结合 context 匹配配置项
        this._config.setValue(name, contributes);
    }

    // 深度遍历配置项树
    private _iterateContribute(obj: any, context: Context) {
        for (let key in obj) {
            // 排除掉原型继承而来的属性
            if (!obj.hasOwnProperty(key)) return;
            // 转化所有的 when 属性
            if (key === 'when') {
                obj[key] = contextMatchesRules(context, ContextKeyExpr.deserialize(obj[key]));
            }
            if (typeof obj[key] == 'object' || typeof obj[key] == 'function') {
                // 递归遍历属性值的子属性
                this._iterateContribute(obj[key], context);
            }
        }
    }
}