# 🚀 Installation Guide

## Quick Installation

### Method 1: From VSIX Package (Recommended)

1. **Package the extension:**
   ```bash
   npm install -g vsce
   vsce package
   ```

2. **Install in VS Code:**
   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Extensions: Install from VSIX"
   - Select the generated `.vsix` file
   - Reload VS Code when prompted

### Method 2: Development Mode

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd vscode-floating-terminal
   npm install
   npm run compile
   ```

2. **Launch extension host:**
   - Open the project in VS Code
   - Press `F5` to launch a new Extension Development Host window
   - Test the extension in the new window

## 🎯 First Use

1. **Open VS Code** with any project
2. **Press `Ctrl+``** (or `Cmd+`` on Mac) to toggle your floating terminal
3. **Enjoy!** Your beautiful floating terminal is ready

## ⚙️ Configuration

Open VS Code settings (`Ctrl+,` or `Cmd+,`) and search for "floating-terminal" to customize:

### Essential Settings
```json
{
  "floating-terminal.width": 80,        // Terminal width (20-95%)
  "floating-terminal.height": 60,       // Terminal height (20-95%)
  "floating-terminal.opacity": 0.95,    // Background opacity
  "floating-terminal.blur": true,       // Enable blur effect
  "floating-terminal.animation": true   // Enable animations
}
```

## 🔧 Troubleshooting

### Terminal doesn't appear
- Ensure the extension is activated
- Try reloading VS Code (`Ctrl+Shift+P` → "Developer: Reload Window")
- Check if any other extensions conflict with terminal keybindings

### Keybindings not working
- Check for conflicting keybindings in VS Code settings
- Try using Command Palette: `Ctrl+Shift+P` → "Floating Terminal: Toggle"

### Performance issues
- Disable blur effect: `"floating-terminal.blur": false`
- Disable animations: `"floating-terminal.animation": false`
- Reduce opacity: `"floating-terminal.opacity": 0.8`

## 📱 Platform Support

- ✅ **Windows**: Full support
- ✅ **macOS**: Full support  
- ✅ **Linux**: Full support

## 🎮 Quick Start Commands

Try these commands after installation:

1. **Toggle terminal**: `Ctrl+``
2. **Create new terminal**: `Ctrl+Shift+``
3. **Close current**: `Ctrl+Shift+W` (when terminal focused)
4. **View all keymaps**: Command Palette → "Floating Terminal: Show Keymaps"

## 🚀 Next Steps

- Explore all keymaps in the [README](README.md)
- Customize appearance in VS Code settings
- Create multiple terminals and switch between them
- Enjoy your Neovim-like floating terminal experience!

---

**Happy coding with your floating terminal! 🎉**