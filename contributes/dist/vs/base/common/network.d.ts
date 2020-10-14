import { URI } from './uri';
export declare namespace Schemas {
    /**
     * A schema that is used for models that exist in memory
     * only and that have no correspondence on a server or such.
     */
    const inMemory = "inmemory";
    /**
     * A schema that is used for setting files
     */
    const vscode = "vscode";
    /**
     * A schema that is used for internal private files
     */
    const internal = "private";
    /**
     * A walk-through document.
     */
    const walkThrough = "walkThrough";
    /**
     * An embedded code snippet.
     */
    const walkThroughSnippet = "walkThroughSnippet";
    const http = "http";
    const https = "https";
    const file = "file";
    const mailto = "mailto";
    const untitled = "untitled";
    const data = "data";
    const command = "command";
    const vscodeRemote = "vscode-remote";
    const vscodeRemoteResource = "vscode-remote-resource";
    const userData = "vscode-userdata";
    const vscodeCustomEditor = "vscode-custom-editor";
    const vscodeSettings = "vscode-settings";
    const webviewPanel = "webview-panel";
}
declare class RemoteAuthoritiesImpl {
    private readonly _hosts;
    private readonly _ports;
    private readonly _connectionTokens;
    private _preferredWebSchema;
    private _delegate;
    setPreferredWebSchema(schema: 'http' | 'https'): void;
    setDelegate(delegate: (uri: URI) => URI): void;
    set(authority: string, host: string, port: number): void;
    setConnectionToken(authority: string, connectionToken: string): void;
    rewrite(uri: URI): URI;
}
export declare const RemoteAuthorities: RemoteAuthoritiesImpl;
export {};
