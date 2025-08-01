import * as vscode from 'vscode';
import * as path from 'path';

interface FloatingTerminalConfig {
    width: number;
    height: number;
    borderRadius: number;
    opacity: number;
    blur: boolean;
    animation: boolean;
    shell: string;
    startupDirectory: string;
    fontSize: number;
    fontFamily: string;
}

export class FloatingTerminalManager {
    private terminals: vscode.Terminal[] = [];
    private currentTerminalIndex: number = -1;
    private isVisible: boolean = false;
    private config: FloatingTerminalConfig;
    private statusBarItem: vscode.StatusBarItem;
    private webviewPanel: vscode.WebviewPanel | undefined;

    constructor(private context: vscode.ExtensionContext) {
        this.config = this.loadConfiguration();
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'floating-terminal.toggle';
        this.statusBarItem.tooltip = 'Toggle Floating Terminal (Ctrl+`)';
        this.updateStatusBar();
        this.statusBarItem.show();
        
        // Listen for terminal events
        vscode.window.onDidCloseTerminal(terminal => {
            this.onTerminalClosed(terminal);
        });
    }

    private loadConfiguration(): FloatingTerminalConfig {
        const config = vscode.workspace.getConfiguration('floating-terminal');
        return {
            width: config.get('width', 80),
            height: config.get('height', 60),
            borderRadius: config.get('borderRadius', 8),
            opacity: config.get('opacity', 0.95),
            blur: config.get('blur', true),
            animation: config.get('animation', true),
            shell: config.get('shell', ''),
            startupDirectory: config.get('startupDirectory', ''),
            fontSize: config.get('fontSize', 14),
            fontFamily: config.get('fontFamily', 'Fira Code, Consolas, Monaco, monospace')
        };
    }

    public updateConfiguration(): void {
        this.config = this.loadConfiguration();
        if (this.webviewPanel) {
            this.updateWebviewStyles();
        }
    }

    public toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    public show(): void {
        if (this.terminals.length === 0) {
            this.createNew();
        } else {
            this.createOrShowWebview();
        }
        this.isVisible = true;
        this.updateStatusBar();
    }

    public hide(): void {
        if (this.webviewPanel) {
            this.webviewPanel.dispose();
            this.webviewPanel = undefined;
        }
        this.isVisible = false;
        this.updateStatusBar();
    }

    public createNew(): void {
        const terminalOptions: vscode.TerminalOptions = {
            name: `Floating Terminal ${this.terminals.length + 1}`,
            hideFromUser: true,
            cwd: this.getStartupDirectory(),
            shellPath: this.config.shell || undefined
        };

        const terminal = vscode.window.createTerminal(terminalOptions);
        this.terminals.push(terminal);
        this.currentTerminalIndex = this.terminals.length - 1;
        
        if (!this.isVisible) {
            this.show();
        } else {
            this.createOrShowWebview();
        }
        
        this.updateStatusBar();
        
        // Show notification for new terminal
        vscode.window.showInformationMessage(
            `Created new floating terminal (${this.terminals.length} total)`,
            { modal: false }
        );
    }

    public closeCurrent(): void {
        if (this.currentTerminalIndex >= 0 && this.currentTerminalIndex < this.terminals.length) {
            const terminal = this.terminals[this.currentTerminalIndex];
            terminal.dispose();
            this.terminals.splice(this.currentTerminalIndex, 1);
            
            if (this.terminals.length === 0) {
                this.currentTerminalIndex = -1;
                this.hide();
            } else {
                this.currentTerminalIndex = Math.max(0, this.currentTerminalIndex - 1);
                this.createOrShowWebview();
            }
            
            this.updateStatusBar();
        }
    }

    public closeAll(): void {
        this.terminals.forEach(terminal => terminal.dispose());
        this.terminals = [];
        this.currentTerminalIndex = -1;
        this.hide();
        this.updateStatusBar();
        
        vscode.window.showInformationMessage('All floating terminals closed');
    }

    public next(): void {
        if (this.terminals.length > 1) {
            this.currentTerminalIndex = (this.currentTerminalIndex + 1) % this.terminals.length;
            this.createOrShowWebview();
            this.updateStatusBar();
        }
    }

    public previous(): void {
        if (this.terminals.length > 1) {
            this.currentTerminalIndex = this.currentTerminalIndex === 0 ? 
                this.terminals.length - 1 : this.currentTerminalIndex - 1;
            this.createOrShowWebview();
            this.updateStatusBar();
        }
    }

    public focus(): void {
        if (this.isVisible && this.webviewPanel) {
            this.webviewPanel.reveal();
        } else {
            this.show();
        }
    }

    public openSettings(): void {
        vscode.commands.executeCommand('workbench.action.openSettings', 'floating-terminal');
    }

    public showKeymapReference(): void {
        const keymaps = `
# Floating Terminal Keymaps

## Main Controls
- **Ctrl+\`** (Cmd+\` on Mac): Toggle floating terminal
- **Ctrl+Shift+\`** (Cmd+Shift+\` on Mac): Create new floating terminal
- **Ctrl+Shift+W** (Cmd+Shift+W on Mac): Close current terminal (when focused)
- **Ctrl+Shift+Alt+W** (Cmd+Shift+Alt+W on Mac): Close all terminals

## Navigation
- **Ctrl+PageDown** (Cmd+PageDown on Mac): Next terminal (when focused)
- **Ctrl+PageUp** (Cmd+PageUp on Mac): Previous terminal (when focused)
- **Ctrl+Shift+\`** (Cmd+Shift+\` on Mac): Focus terminal (when not focused)

## Settings
- **Ctrl+Shift+,** (Cmd+Shift+, on Mac): Open settings (when focused)

## Features
- Beautiful centered floating window with blur effects
- Smooth animations and transitions
- Multiple terminal support with easy switching
- Customizable size, opacity, and styling
- Neovim-like experience with comprehensive keymaps
- Status bar integration showing terminal count
        `;
        
        vscode.workspace.openTextDocument({
            content: keymaps,
            language: 'markdown'
        }).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    }

    private createOrShowWebview(): void {
        if (this.webviewPanel) {
            this.webviewPanel.dispose();
        }

        if (this.currentTerminalIndex < 0 || this.currentTerminalIndex >= this.terminals.length) {
            return;
        }

        this.webviewPanel = vscode.window.createWebviewPanel(
            'floatingTerminal',
            `Floating Terminal (${this.currentTerminalIndex + 1}/${this.terminals.length})`,
            {
                viewColumn: vscode.ViewColumn.Active,
                preserveFocus: false
            },
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: []
            }
        );

        this.webviewPanel.webview.html = this.getWebviewContent();
        
        // Handle webview disposal
        this.webviewPanel.onDidDispose(() => {
            this.webviewPanel = undefined;
            this.isVisible = false;
            this.updateStatusBar();
        });

        // Handle messages from webview
        this.webviewPanel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'focus-terminal':
                    this.focusCurrentTerminal();
                    break;
                case 'close':
                    this.hide();
                    break;
                case 'new':
                    this.createNew();
                    break;
                case 'next':
                    this.next();
                    break;
                case 'previous':
                    this.previous();
                    break;
            }
        });

        // Focus the terminal immediately
        setTimeout(() => {
            this.focusCurrentTerminal();
        }, 100);
    }

    private focusCurrentTerminal(): void {
        if (this.currentTerminalIndex >= 0 && this.currentTerminalIndex < this.terminals.length) {
            const terminal = this.terminals[this.currentTerminalIndex];
            terminal.show(false);
        }
    }

    private getWebviewContent(): string {
        const currentTerminal = this.terminals[this.currentTerminalIndex];
        const terminalName = currentTerminal?.name || 'Terminal';
        
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Floating Terminal</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: ${this.config.fontFamily};
                    font-size: ${this.config.fontSize}px;
                    background: rgba(0, 0, 0, 0.1);
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    ${this.config.blur ? 'backdrop-filter: blur(10px);' : ''}
                    ${this.config.animation ? 'transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);' : ''}
                }
                
                .floating-terminal {
                    width: ${this.config.width}%;
                    height: ${this.config.height}%;
                    background: rgba(30, 30, 30, ${this.config.opacity});
                    border-radius: ${this.config.borderRadius}px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    ${this.config.animation ? 'animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);' : ''}
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .terminal-header {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    user-select: none;
                }
                
                .terminal-title {
                    color: #ffffff;
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .terminal-icon {
                    width: 16px;
                    height: 16px;
                    background: #00d4aa;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    color: #000;
                    font-weight: bold;
                }
                
                .terminal-controls {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                
                .control-btn {
                    width: 28px;
                    height: 28px;
                    border: none;
                    border-radius: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                
                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }
                
                .control-btn.close:hover {
                    background: #ff5f56;
                }
                
                .control-btn.new:hover {
                    background: #00d4aa;
                }
                
                .terminal-counter {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-right: 8px;
                }
                
                .terminal-content {
                    flex: 1;
                    padding: 16px;
                    color: #ffffff;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
                
                .terminal-message {
                    font-size: 16px;
                    margin-bottom: 16px;
                    opacity: 0.9;
                }
                
                .terminal-hint {
                    font-size: 14px;
                    opacity: 0.6;
                    line-height: 1.5;
                }
                
                .keymap-hint {
                    margin-top: 20px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .keymap-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 13px;
                }
                
                .keymap-key {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 11px;
                }
                
                .pulse {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        </head>
        <body>
            <div class="floating-terminal">
                <div class="terminal-header">
                    <div class="terminal-title">
                        <div class="terminal-icon">${this.currentTerminalIndex + 1}</div>
                        ${terminalName}
                    </div>
                    <div class="terminal-controls">
                        <div class="terminal-counter">${this.currentTerminalIndex + 1}/${this.terminals.length}</div>
                        ${this.terminals.length > 1 ? '<button class="control-btn" onclick="previous()" title="Previous Terminal (Ctrl+PageUp)">‹</button>' : ''}
                        ${this.terminals.length > 1 ? '<button class="control-btn" onclick="next()" title="Next Terminal (Ctrl+PageDown)">›</button>' : ''}
                        <button class="control-btn new" onclick="createNew()" title="New Terminal (Ctrl+Shift+\`)">+</button>
                        <button class="control-btn close" onclick="closeTerminal()" title="Close (Ctrl+\`)">×</button>
                    </div>
                </div>
                <div class="terminal-content">
                    <div class="terminal-message pulse">
                        🚀 Terminal is ready and focused!
                    </div>
                    <div class="terminal-hint">
                        The terminal is now active in VS Code.<br>
                        Start typing commands or use the keymaps below.
                    </div>
                    <div class="keymap-hint">
                        <div class="keymap-row">
                            <span>Toggle Terminal:</span>
                            <span class="keymap-key">Ctrl + \`</span>
                        </div>
                        <div class="keymap-row">
                            <span>New Terminal:</span>
                            <span class="keymap-key">Ctrl + Shift + \`</span>
                        </div>
                        <div class="keymap-row">
                            <span>Close Terminal:</span>
                            <span class="keymap-key">Ctrl + Shift + W</span>
                        </div>
                        ${this.terminals.length > 1 ? `
                        <div class="keymap-row">
                            <span>Next/Previous:</span>
                            <span class="keymap-key">Ctrl + PageDown/PageUp</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <script>
                const vscode = acquireVsCodeApi();
                
                function closeTerminal() {
                    vscode.postMessage({ command: 'close' });
                }
                
                function createNew() {
                    vscode.postMessage({ command: 'new' });
                }
                
                function next() {
                    vscode.postMessage({ command: 'next' });
                }
                
                function previous() {
                    vscode.postMessage({ command: 'previous' });
                }
                
                // Auto-focus terminal after a short delay
                setTimeout(() => {
                    vscode.postMessage({ command: 'focus-terminal' });
                }, 200);
                
                // Handle keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        if (e.key === '\`') {
                            e.preventDefault();
                            if (e.shiftKey) {
                                createNew();
                            } else {
                                closeTerminal();
                            }
                        } else if (e.key === 'PageDown') {
                            e.preventDefault();
                            next();
                        } else if (e.key === 'PageUp') {
                            e.preventDefault();
                            previous();
                        }
                    }
                });
            </script>
        </body>
        </html>
        `;
    }

    private updateWebviewStyles(): void {
        if (this.webviewPanel) {
            this.webviewPanel.webview.html = this.getWebviewContent();
        }
    }

    private getStartupDirectory(): string {
        if (this.config.startupDirectory) {
            return this.config.startupDirectory;
        }
        
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            return workspaceFolders[0].uri.fsPath;
        }
        
        return process.env.HOME || process.env.USERPROFILE || '/';
    }

    private onTerminalClosed(terminal: vscode.Terminal): void {
        const index = this.terminals.indexOf(terminal);
        if (index !== -1) {
            this.terminals.splice(index, 1);
            
            if (this.currentTerminalIndex >= this.terminals.length) {
                this.currentTerminalIndex = Math.max(0, this.terminals.length - 1);
            }
            
            if (this.terminals.length === 0) {
                this.currentTerminalIndex = -1;
                this.hide();
            } else if (this.isVisible) {
                this.createOrShowWebview();
            }
            
            this.updateStatusBar();
        }
    }

    private updateStatusBar(): void {
        if (this.terminals.length === 0) {
            this.statusBarItem.text = '$(terminal) Terminal';
            this.statusBarItem.backgroundColor = undefined;
        } else {
            this.statusBarItem.text = `$(terminal) ${this.terminals.length}`;
            this.statusBarItem.backgroundColor = this.isVisible ? 
                new vscode.ThemeColor('statusBarItem.prominentBackground') : undefined;
        }
    }

    public dispose(): void {
        this.terminals.forEach(terminal => terminal.dispose());
        this.statusBarItem.dispose();
        if (this.webviewPanel) {
            this.webviewPanel.dispose();
        }
    }
}