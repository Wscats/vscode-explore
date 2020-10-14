import { IDisposable } from './vs/base/common/lifecycle';
import { TypeConstraint } from './vs/base/common/types';
import { ServicesAccessor } from './vs/platform/instantiation/common/instantiation';
import { Event } from './vs/base/common/event';
import { IJSONSchema } from './vs/base/common/jsonSchema';
export declare const ICommandService: import("./vs/platform/instantiation/common/instantiation").ServiceIdentifier<ICommandService>;
export interface ICommandEvent {
    commandId: string;
    args: any[];
}
export interface ICommandService {
    readonly _serviceBrand: undefined;
    onWillExecuteCommand: Event<ICommandEvent>;
    onDidExecuteCommand: Event<ICommandEvent>;
    executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined>;
}
export declare type ICommandsMap = Map<string, ICommand>;
export interface ICommandHandler {
    (accessor: ServicesAccessor, ...args: any[]): void;
}
export interface ICommand {
    id: string;
    handler: ICommandHandler;
    description?: ICommandHandlerDescription | null;
}
export interface ICommandHandlerDescription {
    readonly description: string;
    readonly args: ReadonlyArray<{
        readonly name: string;
        readonly description?: string;
        readonly constraint?: TypeConstraint;
        readonly schema?: IJSONSchema;
    }>;
    readonly returns?: string;
}
export interface ICommandRegistry {
    onDidRegisterCommand: Event<string>;
    registerCommand(id: string, command: ICommandHandler): IDisposable;
    registerCommand(command: ICommand): IDisposable;
    registerCommandAlias(oldId: string, newId: string): IDisposable;
    getCommand(id: string): ICommand | undefined;
    getCommands(): ICommandsMap;
}
export declare const CommandsRegistry: ICommandRegistry;
export declare const NullCommandService: ICommandService;
