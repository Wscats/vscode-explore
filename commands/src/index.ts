import { CommandsRegistry, ICommandHandlerDescription } from './commands';
console.log(CommandsRegistry);

CommandsRegistry.registerCommand({
    id: 'showEditorScreenReaderNotification',
    handler: (accessor, args) => () => { },
});

CommandsRegistry.registerCommand('workbench.action.tasks.reRunTask', (accessor, arg) => {
    console.log(1);
});


const allCommands = CommandsRegistry.getCommands();
for (const [commandId, command] of allCommands) {
    console.log(commandId, command);
    const commandDescription = command.description;
}


interface CommandOptions {
    repository?: boolean;
    diff?: boolean;
}

interface Command {
    commandId: string;
    key: string;
    method: Function;
    options: CommandOptions;
}

const Commands: Command[] = [];

function command(commandId: string, options: CommandOptions = {}): Function {
    return (_target: any, key: string, descriptor: any) => {
        if (!(typeof descriptor.value === 'function')) {
            throw new Error('not supported');
        }
        Commands.push({ commandId, key, method: descriptor.value, options });
    };
}

// 使用 CommandCenter 收集所有的命令并统一注册
export class CommandCenter {
    private disposables: any[];
    constructor() {
        this.disposables = Commands.map(({ commandId, key, method, options }) => {
            // 统一注册
            return CommandsRegistry.registerCommand(commandId, () => { method() });
        });
    }

    @command('abc.abc')
    abc() {
    }
    @command('cba.cba')
    cba() {
    }
    @command('aaa.aaa')
    aaa() {
    }
}

new CommandCenter();
console.log(Commands);