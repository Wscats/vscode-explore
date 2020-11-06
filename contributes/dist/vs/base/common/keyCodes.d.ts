/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
export declare class ResolvedKeybindingPart {
    readonly ctrlKey: boolean;
    readonly shiftKey: boolean;
    readonly altKey: boolean;
    readonly metaKey: boolean;
    readonly keyLabel: string | null;
    readonly keyAriaLabel: string | null;
    constructor(ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean, kbLabel: string | null, kbAriaLabel: string | null);
}
/**
 * A resolved keybinding. Can be a simple keybinding or a chord keybinding.
 */
export declare abstract class ResolvedKeybinding {
    /**
     * This prints the binding in a format suitable for displaying in the UI.
     */
    abstract getLabel(): string | null;
    /**
     * This prints the binding in a format suitable for ARIA.
     */
    abstract getAriaLabel(): string | null;
    /**
     * This prints the binding in a format suitable for electron's accelerators.
     * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
     */
    abstract getElectronAccelerator(): string | null;
    /**
     * This prints the binding in a format suitable for user settings.
     */
    abstract getUserSettingsLabel(): string | null;
    /**
     * Is the user settings label reflecting the label?
     */
    abstract isWYSIWYG(): boolean;
    /**
     * Is the binding a chord?
     */
    abstract isChord(): boolean;
    /**
     * Returns the parts that comprise of the keybinding.
     * Simple keybindings return one element.
     */
    abstract getParts(): ResolvedKeybindingPart[];
    /**
     * Returns the parts that should be used for dispatching.
     */
    abstract getDispatchParts(): (string | null)[];
}
