# 🚀 Console Invaders

A retro Space Invaders game that runs entirely in the browser console! This is a simple single-file implementation perfect for demos or adding as an easter egg to web projects.

## Features

- 🎮 Classic Space Invaders gameplay rendered in the console
- 🎯 Simple arrow key movement and spacebar shooting
- 👾 4 rows of aliens with collision detection
- 🔥 Visual feedback with colored console styling
- 📦 Zero dependencies, single HTML file
- 🎨 Retro terminal aesthetic

## Quick Start

1. Open `index.html` in your web browser
2. Open the browser console (F12)
3. Type `invaders()` to start the game

## Usage

### Local Development
Simply open `index.html` in any modern web browser. The game script is included inline.

### Integration
Copy the JavaScript code from `console-invaders.js` and include it in your project:

```html
<script src="console-invaders.js"></script>
<script>
  // Game is now available
  invaders(); // Start the game
</script>
```

## Game Controls

- **Arrow Keys**: Move left/right
- **Spacebar**: Shoot laser

## How It Works

The game uses styled `console.log()` statements to render a 10x20 grid in the browser console. The player controls a ship at the bottom, shooting at 4 rows of aliens arranged above. When a laser hits an alien, it's marked as destroyed and the game resets when all aliens are cleared.

## Project Structure

- `index.html` - Demo page with embedded game
- `console-invaders.js` - Standalone game script
- Single-file implementation with no build process required

## Customization

The game code is straightforward JavaScript that can be easily modified:
- Adjust grid size by changing render dimensions
- Modify alien patterns in the initialization
- Add new features like multiple lives or power-ups
- Change visual styling with different console colors

---

**Open your console and type `invaders()` to start! 🎮**