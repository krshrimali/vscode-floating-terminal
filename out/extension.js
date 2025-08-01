"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const floatingTerminalManager_1 = require("./floatingTerminalManager");
let floatingTerminalManager;
function activate(context) {
    console.log('Floating Terminal extension is now active!');
    floatingTerminalManager = new floatingTerminalManager_1.FloatingTerminalManager(context);
    // Register all commands
    const commands = [
        vscode.commands.registerCommand('floating-terminal.toggle', () => {
            floatingTerminalManager.toggle();
        }),
        vscode.commands.registerCommand('floating-terminal.new', () => {
            floatingTerminalManager.createNew();
        }),
        vscode.commands.registerCommand('floating-terminal.close', () => {
            floatingTerminalManager.closeCurrent();
        }),
        vscode.commands.registerCommand('floating-terminal.closeAll', () => {
            floatingTerminalManager.closeAll();
        }),
        vscode.commands.registerCommand('floating-terminal.next', () => {
            floatingTerminalManager.next();
        }),
        vscode.commands.registerCommand('floating-terminal.previous', () => {
            floatingTerminalManager.previous();
        }),
        vscode.commands.registerCommand('floating-terminal.focus', () => {
            floatingTerminalManager.focus();
        }),
        vscode.commands.registerCommand('floating-terminal.settings', () => {
            floatingTerminalManager.openSettings();
        })
    ];
    commands.forEach(command => context.subscriptions.push(command));
    // Listen for configuration changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('floating-terminal')) {
            floatingTerminalManager.updateConfiguration();
        }
    }));
    // Show welcome message on first activation
    const hasShownWelcome = context.globalState.get('floating-terminal.hasShownWelcome', false);
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage('Floating Terminal is ready! Press Ctrl+` (Cmd+` on Mac) to toggle your floating terminal.', 'Show Keymaps').then(selection => {
            if (selection === 'Show Keymaps') {
                floatingTerminalManager.showKeymapReference();
            }
        });
        context.globalState.update('floating-terminal.hasShownWelcome', true);
    }
}
exports.activate = activate;
function deactivate() {
    if (floatingTerminalManager) {
        floatingTerminalManager.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map