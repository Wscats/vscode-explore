import { ExtensionsRegistry } from './vs/workbench/services/extensions/common/extensionsRegistry';
import { localize } from './vs/nls';
console.log(1);
console.log(ExtensionsRegistry);

export type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'array' | 'object';

export interface IJSONSchema {
    id?: string;
    $id?: string;
    $schema?: string;
    type?: JSONSchemaType | JSONSchemaType[];
    title?: string;
    default?: any;
    definitions?: IJSONSchemaMap;
    description?: string;
    properties?: IJSONSchemaMap;
    patternProperties?: IJSONSchemaMap;
    additionalProperties?: boolean | IJSONSchema;
    minProperties?: number;
    maxProperties?: number;
    dependencies?: IJSONSchemaMap | { [prop: string]: string[] };
    items?: IJSONSchema | IJSONSchema[];
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    additionalItems?: boolean | IJSONSchema;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean | number;
    exclusiveMaximum?: boolean | number;
    multipleOf?: number;
    required?: string[];
    $ref?: string;
    anyOf?: IJSONSchema[];
    allOf?: IJSONSchema[];
    oneOf?: IJSONSchema[];
    not?: IJSONSchema;
    enum?: any[];
    format?: string;

    // schema draft 06
    const?: any;
    contains?: IJSONSchema;
    propertyNames?: IJSONSchema;

    // schema draft 07
    $comment?: string;
    if?: IJSONSchema;
    then?: IJSONSchema;
    else?: IJSONSchema;

    // VS Code extensions
    defaultSnippets?: IJSONSchemaSnippet[];
    errorMessage?: string;
    patternErrorMessage?: string;
    deprecationMessage?: string;
    markdownDeprecationMessage?: string;
    enumDescriptions?: string[];
    markdownEnumDescriptions?: string[];
    markdownDescription?: string;
    doNotSuggest?: boolean;
    suggestSortText?: string;
    allowComments?: boolean;
    allowTrailingCommas?: boolean;
}

export interface IJSONSchemaMap {
    [name: string]: IJSONSchema;
}

export interface IJSONSchemaSnippet {
    label?: string;
    description?: string;
    body?: any; // a object that will be JSON stringified
    bodyText?: string; // an already stringified JSON object that can contain new lines (\n) and tabs (\t)
}


const commandType: IJSONSchema = {
    type: 'object',
    required: ['command', 'title'],
    properties: {
        command: {
            description: localize('vscode.extension.contributes.commandType.command', 'Identifier of the command to execute'),
            type: 'string'
        },
        title: {
            description: localize('vscode.extension.contributes.commandType.title', 'Title by which the command is represented in the UI'),
            type: 'string'
        },
        category: {
            description: localize('vscode.extension.contributes.commandType.category', '(Optional) Category string by the command is grouped in the UI'),
            type: 'string'
        },
        enablement: {
            description: localize('vscode.extension.contributes.commandType.precondition', '(Optional) Condition which must be true to enable the command'),
            type: 'string'
        },
        icon: {
            description: localize('vscode.extension.contributes.commandType.icon', '(Optional) Icon which is used to represent the command in the UI. Either a file path, an object with file paths for dark and light themes, or a theme icon references, like `$(zap)`'),
            anyOf: [{
                type: 'string'
            },
            {
                type: 'object',
                properties: {
                    light: {
                        description: localize('vscode.extension.contributes.commandType.icon.light', 'Icon path when a light theme is used'),
                        type: 'string'
                    },
                    dark: {
                        description: localize('vscode.extension.contributes.commandType.icon.dark', 'Icon path when a dark theme is used'),
                        type: 'string'
                    }
                }
            }]
        }
    }
};

ExtensionsRegistry.registerExtensionPoint({
    extensionPoint: 'toolbar',
    jsonSchema: {
        description: localize('vscode.extension.contributes.commands', "Contributes commands to the command palette."),
        oneOf: [
            commandType,
            {
                type: 'array',
                items: commandType
            }
        ]
    }
}).setHandler((extensions) => {
    console.log(234);
    console.log(extensions);
});;

const extensionPoints = ExtensionsRegistry.getExtensionPoints();
// @ts-ignore
console.log(extensionPoints[0]._handler())
// const affectedExtensionPoints: { [extPointName: string]: boolean; } = Object.create(null);
// for (const extensionPoint of extensionPoints) {
//     if (affectedExtensionPoints[extensionPoint.name]) {
//         AbstractExtensionService._handleExtensionPoint(extensionPoint, availableExtensions, messageHandler);
//     }
// }