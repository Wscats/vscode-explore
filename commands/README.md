# Commands

```js
import { CommandsRegistry, ICommandHandlerDescription } from './commands';

CommandsRegistry.registerCommand('workbench.action.tasks.reRunTask', (accessor, arg) => {
    console.log('hello world');
});

const allCommands = CommandsRegistry.getCommands();
for (const [commandId, command] of allCommands) {
    console.log(commandId, command);
    const commandDescription = command.description;
}
```