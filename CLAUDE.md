# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a simple HTML/JavaScript game with no build system. To run:
- Open `index.html` in a web browser
- No build, test, or lint commands are configured

## Project Architecture

This is a single-file browser-based Space Invaders clone called "Console Invaders". The entire game is contained within `index.html` with inline JavaScript.

### Game Structure
- **Rendering System**: Uses styled `console.log()` to display the game in the browser console
- **Game Loop**: Event-driven system responding to keyboard input (Arrow keys for movement, Space for shooting)
- **Game State**: 
  - `playerPosition`: Horizontal position of player (0-19)
  - `aliens`: Array of alien objects with `{x, y, isHit}` properties
  - `laserActive`: Boolean flag for laser display
  - `rowDirections`: Array tracking movement direction per alien row

### Key Functions
- `render()`: Draws game state to console with colored styling
- `gameLoop()`: Processes player actions and updates game state
- `checkCollision()`: Handles laser-alien collision detection
- `initializeGameState()`: Resets game for new round
- `updateAlienPositions()`: Handles alien movement (currently disabled)

### Game Mechanics
- Player controls a ship at the bottom row using arrow keys
- Shooting with spacebar creates a laser that hits the first alien in the column
- Aliens are arranged in 4 rows of 7, with alternating row offsets
- Game resets when all aliens are defeated
- Visual feedback uses console styling with different colors for player (blue), aliens (green), lasers (red), and explosions (orange)

## Development Notes
- The alien movement system is implemented but currently disabled (line 155)
- Game uses a 10x20 grid displayed in browser console
- All game logic is contained in inline JavaScript within the HTML file