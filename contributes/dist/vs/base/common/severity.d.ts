/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
declare enum Severity {
    Ignore = 0,
    Info = 1,
    Warning = 2,
    Error = 3
}
declare namespace Severity {
    /**
     * Parses 'error', 'warning', 'warn', 'info' in call casings
     * and falls back to ignore.
     */
    function fromValue(value: string): Severity;
}
export default Severity;
