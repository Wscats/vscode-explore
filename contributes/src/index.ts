import { ExtensionsRegistry, ExtensionMessageCollector, ExtensionPoint, IExtensionPoint, IExtensionPointUser } from './vs/workbench/services/extensions/common/extensionsRegistry';
import { IExtensionManifest, ExtensionIdentifier, IExtensionDescription, } from './vs/platform/extensions/common/extensions';
import { ActivationTimes, ExtensionPointContribution, IExtensionService, IExtensionsStatus, IMessage, IWillActivateEvent, IResponsiveStateChangeEvent, toExtension } from './vs/workbench/services/extensions/common/extensions';
import { localize } from './vs/nls';
import { IJSONSchema } from './vs/base/common/jsonSchema';
import { URI } from './vs/base/common/uri';
import { ContextKeyExpr, ContextKeyExpression } from './vs/platform/contextkey/common/contextkey';
import { MenuId, MenuRegistry, ILocalizedString, IMenuItem, ICommandAction } from './vs/platform/actions/common/actions';
// @ts-ignore
import config from './config.json';
import { _commandRegistrations } from './register';
console.log(_commandRegistrations);
// export { ToolbarsContribution, PcShortToolbarButtonConfig };
const hasOwnProperty = Object.hasOwnProperty;
function _doHandleExtensionPoints(affectedExtensions: IExtensionDescription[]): void {
    console.log('-----------_doHandleExtensionPoints------------');
    const affectedExtensionPoints: { [extPointName: string]: boolean; } = Object.create(null);
    for (let extensionDescription of affectedExtensions) {
        if (extensionDescription.contributes) {
            for (let extPointName in extensionDescription.contributes) {
                if (hasOwnProperty.call(extensionDescription.contributes, extPointName)) {
                    // 收集能启动的配置项
                    affectedExtensionPoints[extPointName] = true;
                }
            }
        }
    }

    // const messageHandler = (msg: IMessage) => this._handleExtensionPointMessage(msg);
    // 过滤可启用的配置项
    // const availableExtensions = this._registry.getAllExtensionDescriptions();
    const messageHandler = () => { console.log(1) }
    const availableExtensions = affectedExtensions;
    const extensionPoints = ExtensionsRegistry.getExtensionPoints();
    for (const extensionPoint of extensionPoints) {
        // 将可用的配置项进行注册
        if (affectedExtensionPoints[extensionPoint.name]) {
            _handleExtensionPoint(extensionPoint, availableExtensions, messageHandler);
        }
    }
}

function _handleExtensionPoint<T>(extensionPoint: ExtensionPoint<T>, availableExtensions: IExtensionDescription[], messageHandler: (msg: IMessage) => void): void {
    const users: IExtensionPointUser<T>[] = [];
    for (const desc of availableExtensions) {
        if (desc.contributes && hasOwnProperty.call(desc.contributes, extensionPoint.name)) {
            users.push({
                description: desc,
                value: desc.contributes[extensionPoint.name as keyof typeof desc.contributes],
                collector: new ExtensionMessageCollector(messageHandler, desc, extensionPoint.name)
            });
        }
    }
    extensionPoint.acceptUsers(users);
}

interface IStaticExtension {
    packageJSON: IExtensionManifest;
    extensionLocation: URI;
}

// 读插件配置
// @ts-ignore
const staticExtensions: readonly IStaticExtension[] = config.staticExtensions;

const descriptions = staticExtensions.map(data => <IExtensionDescription>{
    identifier: new ExtensionIdentifier(`${data.packageJSON.publisher}.${data.packageJSON.name}`),
    extensionLocation: data.extensionLocation,
    ...data.packageJSON,
});

// 处理所有插件配置项
_doHandleExtensionPoints(descriptions);

for (const commandId of MenuRegistry.getCommands().keys()) {
    console.log(MenuRegistry.getCommand(commandId));
    
}
console.log(MenuRegistry);