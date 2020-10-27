import { ContextKeyExpression } from './vs/platform/contextkey/common/contextkey';
import { IJSONSchema } from './vs/base/common/jsonSchema';
import { ExtensionMessageCollector } from './vs/workbench/services/extensions/common/extensionsRegistry';
export declare namespace schema {
    interface IToolbarRegistrations {
        id: string;
        command: string;
        alt?: string;
        when?: ContextKeyExpression;
        group?: string;
        component?: any;
    }
    type IUserFriendlyIcon = string | {
        light: string;
        dark: string;
    };
    interface IUserFriendlyCommand {
        command: string;
        icon?: string;
        alt?: string;
        when?: string;
        group?: string;
        component?: any;
    }
    function isValidCommand(command: IUserFriendlyCommand, collector: ExtensionMessageCollector): boolean;
    const toolbarsContribution: IJSONSchema;
}
