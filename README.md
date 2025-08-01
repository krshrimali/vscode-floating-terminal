# 🚀 Floating Terminal for VS Code

A beautiful, Neovim-inspired floating terminal extension for Visual Studio Code with comprehensive keymaps and stunning visual effects.

![Floating Terminal Demo](https://img.shields.io/badge/VS%20Code-Extension-blue?style=for-the-badge&logo=visual-studio-code)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- **🎯 Centered Floating Window**: Beautiful, centered terminal that floats above your code
- **⚡ Neovim-like Experience**: Comprehensive keymaps inspired by Neovim's floating terminal
- **🎨 Stunning Visuals**: Blur effects, smooth animations, and modern design
- **📱 Multiple Terminals**: Create and manage multiple floating terminals with easy switching
- **⚙️ Highly Customizable**: Extensive configuration options for size, opacity, styling, and more
- **🔄 Status Bar Integration**: Visual indicator showing terminal count and status
- **⌨️ Rich Keymaps**: Complete keyboard control for all operations
- **🎪 Smooth Animations**: Elegant slide-in animations and transitions
- **🔧 Auto-focus**: Terminals automatically focus when opened

## 🚀 Quick Start

1. Install the extension
2. Press `Ctrl+`` (or `Cmd+`` on Mac) to toggle your floating terminal
3. Start coding with your beautiful floating terminal!

## ⌨️ Keymaps

### Main Controls
| Keymap | Action | Description |
|--------|--------|-------------|
| `Ctrl+`` | Toggle Terminal | Show/hide the floating terminal |
| `Ctrl+Shift+`` | New Terminal | Create a new floating terminal |
| `Ctrl+Shift+W` | Close Current | Close the current terminal (when focused) |
| `Ctrl+Shift+Alt+W` | Close All | Close all floating terminals |

### Navigation
| Keymap | Action | Description |
|--------|--------|-------------|
| `Ctrl+PageDown` | Next Terminal | Switch to next terminal (when focused) |
| `Ctrl+PageUp` | Previous Terminal | Switch to previous terminal (when focused) |
| `Ctrl+Shift+`` | Focus Terminal | Focus terminal (when not focused) |

### Settings
| Keymap | Action | Description |
|--------|--------|-------------|
| `Ctrl+Shift+,` | Open Settings | Open floating terminal settings (when focused) |

> **Note**: On Mac, replace `Ctrl` with `Cmd` for all keymaps.

## ⚙️ Configuration

Customize your floating terminal experience with these settings:

### Appearance
```json
{
  "floating-terminal.width": 80,           // Width as percentage (20-95)
  "floating-terminal.height": 60,          // Height as percentage (20-95)
  "floating-terminal.borderRadius": 8,     // Border radius in pixels (0-20)
  "floating-terminal.opacity": 0.95,       // Background opacity (0.1-1.0)
  "floating-terminal.blur": true,          // Enable backdrop blur effect
  "floating-terminal.animation": true      // Enable smooth animations
}
```

### Terminal Settings
```json
{
  "floating-terminal.shell": "",                    // Custom shell path (empty = system default)
  "floating-terminal.startupDirectory": "",         // Custom startup directory (empty = workspace root)
  "floating-terminal.fontSize": 14,                 // Font size (8-24)
  "floating-terminal.fontFamily": "Fira Code, Consolas, Monaco, monospace"  // Font family
}
```

## 🎨 Visual Features

- **Backdrop Blur**: Modern glass-morphism effect with customizable blur
- **Smooth Animations**: Elegant slide-in animations with cubic-bezier easing
- **Rounded Corners**: Customizable border radius for modern aesthetics
- **Status Indicators**: Visual feedback with colored status bar integration
- **Interactive Controls**: Hover effects and smooth button interactions
- **Terminal Counter**: Shows current terminal index and total count
- **Responsive Design**: Adapts to different screen sizes and VS Code themes

## 🔧 Commands

Access these commands via Command Palette (`Ctrl+Shift+P`):

- `Floating Terminal: Toggle Floating Terminal`
- `Floating Terminal: New Floating Terminal`
- `Floating Terminal: Close Current Floating Terminal`
- `Floating Terminal: Close All Floating Terminals`
- `Floating Terminal: Next Floating Terminal`
- `Floating Terminal: Previous Floating Terminal`
- `Floating Terminal: Focus Floating Terminal`
- `Floating Terminal: Floating Terminal Settings`

## 🎯 Use Cases

- **Quick Commands**: Run quick commands without losing focus on your code
- **Development Workflow**: Keep terminals handy while coding
- **Multiple Projects**: Switch between different terminal contexts
- **Presentation Mode**: Beautiful terminals for demos and presentations
- **Neovim Users**: Familiar floating terminal experience in VS Code

## 🔄 Status Bar Integration

The extension adds a status bar item that shows:
- Terminal icon when no terminals are active
- Terminal count when terminals exist
- Highlighted background when terminal is visible
- Click to toggle terminal visibility

## 🎪 Advanced Features

### Multi-Terminal Management
- Create unlimited floating terminals
- Easy switching with keyboard shortcuts
- Automatic terminal indexing and naming
- Persistent terminal sessions

### Smart Focus Management
- Auto-focus terminals when opened
- Preserve focus context when switching
- Intelligent terminal activation

### Configuration Hot-Reload
- Changes to settings apply immediately
- No need to restart VS Code
- Live preview of styling changes

## 🛠️ Development

To set up the development environment:

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package extension
vsce package
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Neovim's floating terminal functionality
- Built with VS Code Extension API
- Designed for modern development workflows

---

**Enjoy your beautiful floating terminal! 🚀**

> Made with ❤️ for the VS Code community
