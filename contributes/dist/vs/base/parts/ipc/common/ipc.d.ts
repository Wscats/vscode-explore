import { Event } from '../../../common/event';
import { IDisposable } from '../../../common/lifecycle';
import { CancellationToken } from '../../../common/cancellation';
import { VSBuffer } from '../../../common/buffer';
/**
 * An `IChannel` is an abstraction over a collection of commands.
 * You can `call` several commands on a channel, each taking at
 * most one single argument. A `call` always returns a promise
 * with at most one single return value.
 */
export interface IChannel {
    call<T>(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T>;
    listen<T>(event: string, arg?: any): Event<T>;
}
/**
 * An `IServerChannel` is the counter part to `IChannel`,
 * on the server-side. You should implement this interface
 * if you'd like to handle remote promises or events.
 */
export interface IServerChannel<TContext = string> {
    call<T>(ctx: TContext, command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T>;
    listen<T>(ctx: TContext, event: string, arg?: any): Event<T>;
}
export declare const enum RequestType {
    Promise = 100,
    PromiseCancel = 101,
    EventListen = 102,
    EventDispose = 103
}
export declare const enum ResponseType {
    Initialize = 200,
    PromiseSuccess = 201,
    PromiseError = 202,
    PromiseErrorObj = 203,
    EventFire = 204
}
export interface IMessagePassingProtocol {
    send(buffer: VSBuffer): void;
    onMessage: Event<VSBuffer>;
}
/**
 * An `IChannelServer` hosts a collection of channels. You are
 * able to register channels onto it, provided a channel name.
 */
export interface IChannelServer<TContext = string> {
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
}
/**
 * An `IChannelClient` has access to a collection of channels. You
 * are able to get those channels, given their channel name.
 */
export interface IChannelClient {
    getChannel<T extends IChannel>(channelName: string): T;
}
export interface Client<TContext> {
    readonly ctx: TContext;
}
export interface IConnectionHub<TContext> {
    readonly connections: Connection<TContext>[];
    readonly onDidAddConnection: Event<Connection<TContext>>;
    readonly onDidRemoveConnection: Event<Connection<TContext>>;
}
/**
 * An `IClientRouter` is responsible for routing calls to specific
 * channels, in scenarios in which there are multiple possible
 * channels (each from a separate client) to pick from.
 */
export interface IClientRouter<TContext = string> {
    routeCall(hub: IConnectionHub<TContext>, command: string, arg?: any, cancellationToken?: CancellationToken): Promise<Client<TContext>>;
    routeEvent(hub: IConnectionHub<TContext>, event: string, arg?: any): Promise<Client<TContext>>;
}
/**
 * Similar to the `IChannelClient`, you can get channels from this
 * collection of channels. The difference being that in the
 * `IRoutingChannelClient`, there are multiple clients providing
 * the same channel. You'll need to pass in an `IClientRouter` in
 * order to pick the right one.
 */
export interface IRoutingChannelClient<TContext = string> {
    getChannel<T extends IChannel>(channelName: string, router?: IClientRouter<TContext>): T;
}
export declare class ChannelServer<TContext = string> implements IChannelServer<TContext>, IDisposable {
    private protocol;
    private ctx;
    private timeoutDelay;
    private channels;
    private activeRequests;
    private protocolListener;
    private pendingRequests;
    constructor(protocol: IMessagePassingProtocol, ctx: TContext, timeoutDelay?: number);
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
    private sendResponse;
    private send;
    private sendBuffer;
    private onRawMessage;
    private onPromise;
    private onEventListen;
    private disposeActiveRequest;
    private collectPendingRequest;
    private flushPendingRequests;
    dispose(): void;
}
export declare class ChannelClient implements IChannelClient, IDisposable {
    private protocol;
    private state;
    private activeRequests;
    private handlers;
    private lastRequestId;
    private protocolListener;
    private readonly _onDidInitialize;
    readonly onDidInitialize: Event<void>;
    constructor(protocol: IMessagePassingProtocol);
    getChannel<T extends IChannel>(channelName: string): T;
    private requestPromise;
    private requestEvent;
    private sendRequest;
    private send;
    private sendBuffer;
    private onBuffer;
    private onResponse;
    private whenInitialized;
    dispose(): void;
}
export interface ClientConnectionEvent {
    protocol: IMessagePassingProtocol;
    onDidClientDisconnect: Event<void>;
}
interface Connection<TContext> extends Client<TContext> {
    readonly channelServer: ChannelServer<TContext>;
    readonly channelClient: ChannelClient;
}
/**
 * An `IPCServer` is both a channel server and a routing channel
 * client.
 *
 * As the owner of a protocol, you should extend both this
 * and the `IPCClient` classes to get IPC implementations
 * for your protocol.
 */
export declare class IPCServer<TContext = string> implements IChannelServer<TContext>, IRoutingChannelClient<TContext>, IConnectionHub<TContext>, IDisposable {
    private channels;
    private _connections;
    private readonly _onDidAddConnection;
    readonly onDidAddConnection: Event<Connection<TContext>>;
    private readonly _onDidRemoveConnection;
    readonly onDidRemoveConnection: Event<Connection<TContext>>;
    get connections(): Connection<TContext>[];
    constructor(onDidClientConnect: Event<ClientConnectionEvent>);
    /**
     * Get a channel from a remote client. When passed a router,
     * one can specify which client it wants to call and listen to/from.
     * Otherwise, when calling without a router, a random client will
     * be selected and when listening without a router, every client
     * will be listened to.
     */
    getChannel<T extends IChannel>(channelName: string, router: IClientRouter<TContext>): T;
    getChannel<T extends IChannel>(channelName: string, clientFilter: (client: Client<TContext>) => boolean): T;
    private getMulticastEvent;
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
    dispose(): void;
}
/**
 * An `IPCClient` is both a channel client and a channel server.
 *
 * As the owner of a protocol, you should extend both this
 * and the `IPCClient` classes to get IPC implementations
 * for your protocol.
 */
export declare class IPCClient<TContext = string> implements IChannelClient, IChannelServer<TContext>, IDisposable {
    private channelClient;
    private channelServer;
    constructor(protocol: IMessagePassingProtocol, ctx: TContext);
    getChannel<T extends IChannel>(channelName: string): T;
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
    dispose(): void;
}
export declare function getDelayedChannel<T extends IChannel>(promise: Promise<T>): T;
export declare function getNextTickChannel<T extends IChannel>(channel: T): T;
export declare class StaticRouter<TContext = string> implements IClientRouter<TContext> {
    private fn;
    constructor(fn: (ctx: TContext) => boolean | Promise<boolean>);
    routeCall(hub: IConnectionHub<TContext>): Promise<Client<TContext>>;
    routeEvent(hub: IConnectionHub<TContext>): Promise<Client<TContext>>;
    private route;
}
export {};
