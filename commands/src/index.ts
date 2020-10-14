import { CommandsRegistry, ICommandHandlerDescription } from './commands';
console.log(CommandsRegistry);

CommandsRegistry.registerCommand({
    id: 'showEditorScreenReaderNotification',
    handler: (accessor, args) => () => { },
});

CommandsRegistry.registerCommand('workbench.action.tasks.reRunTask', (accessor, arg) => {
    console.log(1);
});

console.log(CommandsRegistry.getCommands());

const allCommands = CommandsRegistry.getCommands();
for (const [commandId, command] of allCommands) {
    console.log(commandId, command);
    const commandDescription = command.description;
}