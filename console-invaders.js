/**
 * Console Invaders - Standalone CDN Version
 * A retro Space Invaders game that runs in the browser console
 * 
 * Usage:
 * <script src="https://cdn.jsdelivr.net/gh/username/console-invaders/console-invaders-cdn.js"></script>
 * 
 * Auto-enables: Konami code (↑↑↓↓←→←→BA), Ctrl+Shift+I, and invaders() command
 */
(function() {
  'use strict';

  // Game Engine Class
  class ConsoleInvadersEngine {
    constructor() {
      this.GAME_WIDTH = 20;
      this.GAME_HEIGHT = 10;
      this.PLAYER_ROW = 9;
      this.ALIEN_ROWS = 4;
      this.ALIENS_PER_ROW = 7;
      this.ALIEN_OFFSET = 2;
      this.BASE_ALIEN_MOVE_SPEED = 1000;
      this.SPEED_INCREASE_PER_LEVEL = 0.2;
      this.ALIEN_DROP_DISTANCE = 1;
      this.POINTS_PER_KILL = 10;
      this.REFRESH_RATE = 200;
      this.EXPLOSION_DURATION = 400;
      this.BIG_EXPLOSION_DURATION = 1000;
      
      this.NOSTALGIC_MESSAGES = [
        "Fuck yeah!",
        "Make console great again!",
        "I know what you did in 1969.",
        "Area 51 is the real.",
        "Trust the plan!",
        "Psyop Blue Beam at full speed!",
        "The cake is a lie.",
        "All your base are belong to us.",
        "Winner winner chicken dinner!",
        "Get over here!",
        "Let's Go Brandon",
        "Insert coin to continue.",
        "Game over man, game over!",
        "Do a barrel roll!",
        "Snake? Snake?! SNAAAAKE!",
        "Press F to fuck off.",
        "But can it run Doom?",
        "Loading... please wait.",
        "The truth is out there.",
        "Phone home.",
        "Take me to your leader.",
        "Welcome to Earth, motherfucker!",
      ];
      
      this.lastMessageTime = 0;
      this.currentRandomMessage = null;
      this.hasFocus = true;

      this.STYLES = {
        player: "color: cyan; font-weight: bold; font-size: 42px; font-family: monospace;",
        alien: "color: green; font-size: 42px; font-family: monospace;",
        laser: "color: red; font-size: 42px; font-family: monospace;",
        explosion: "color: orange; font-weight: bold; font-size: 42px; font-family: monospace;",
        empty: "color: black; font-size: 42px; font-family: monospace;"
      };

      this.reset();
    }

    reset() {
      this.playerPosition = Math.floor(this.GAME_WIDTH / 2);
      this.aliens = [];
      this.laserActive = false;
      this.alienMovementInterval = null;
      this.gameInterval = null;
      this.alienDirection = 1;
      this.explosions = [];
      this.bigExplosion = null;
      this.needsRender = true;
      this.isPaused = false;
      this.gameOver = false;
      this.levelComplete = false;
      this.gameStarted = false;
      this.totalScore = 0;
      this.currentLevel = 1;
      this.lastMessageTime = 0;
      this.currentRandomMessage = null;
      this.hasFocus = true;
    }

    getRandomMessage() {
      const now = Date.now();
      // Don't show message immediately on start - wait for first interval
      if (this.lastMessageTime === 0) {
        this.lastMessageTime = now;
        return;
      }
      
      if (now - this.lastMessageTime > 8000 + Math.random() * 12000) { // 8-20 seconds
        this.lastMessageTime = now;
        this.currentRandomMessage = this.NOSTALGIC_MESSAGES[Math.floor(Math.random() * this.NOSTALGIC_MESSAGES.length)];
        setTimeout(() => { this.currentRandomMessage = null; }, 3000); // Show for 3 seconds
      }
    }

    getCurrentAlienSpeed() {
      return this.BASE_ALIEN_MOVE_SPEED / (1 + (this.currentLevel - 1) * this.SPEED_INCREASE_PER_LEVEL);
    }

    render() {
      if (!this.needsRender) return;
      
      const gameArea = Array(this.GAME_HEIGHT).fill(null).map(() => Array(this.GAME_WIDTH).fill(" "));
      let styledString = "";
      let styles = [];

      const now = Date.now();
      const oldExplosionCount = this.explosions.length;
      this.explosions = this.explosions.filter(explosion => now - explosion.timestamp < this.EXPLOSION_DURATION);
      
      if (this.bigExplosion && now - this.bigExplosion.timestamp >= this.BIG_EXPLOSION_DURATION) {
        this.bigExplosion = null;
        this.needsRender = true;
      }
      
      if (this.explosions.length !== oldExplosionCount || this.bigExplosion) {
        this.needsRender = true;
      }

      gameArea.forEach((row, y) => {
        styledString += `%c│`;
        styles.push("color: gray; font-size: 42px; font-family: monospace;");

        row.forEach((_, x) => {
          const alien = this.aliens.find(a => a.x === x && a.y === y && !a.isHit);
          const explosion = this.explosions.find(e => e.x === x && e.y === y);
          const bigExplosionPart = this.bigExplosion && this.bigExplosion.positions.find(pos => pos.x === x && pos.y === y);

          if (bigExplosionPart) {
            styledString += `%c@`;
            styles.push(this.STYLES.explosion);
          } else if (explosion) {
            styledString += `%c@`;
            styles.push(this.STYLES.explosion);
          } else if (y === this.PLAYER_ROW && x === this.playerPosition) {
            styledString += `%c^`;
            styles.push(this.STYLES.player);
          } else if (this.laserActive && !alien && y < this.PLAYER_ROW && x === this.playerPosition) {
            styledString += `%c|`;
            styles.push(this.STYLES.laser);
          } else if (alien) {
            styledString += `%c#`;
            styles.push(this.STYLES.alien);
          } else {
            styledString += `%c `;
            styles.push(this.STYLES.empty);
          }
        });

        styledString += `%c│`;
        styles.push("color: gray; font-size: 42px; font-family: monospace;");
        styledString += "\n";
      });

      console.clear();
      console.log(styledString, ...styles);
      
      this.getRandomMessage();
      
      if (!this.gameStarted) {
        console.log("%cPress SPACE to start Console Invaders!", "color: cyan; font-weight: bold; font-size: 18px;");
      } else if (this.isPaused) {
        console.log("%cPAUSED - Press P to resume | Lvl: " + this.currentLevel + " | Score: " + this.totalScore, "color: yellow; font-weight: bold; font-size: 18px;");
      } else if (this.gameOver) {
        console.log("%cGAME OVER - Press SPACE to start new game | Lvl: " + this.currentLevel + " | Score: " + this.totalScore, "color: cyan; font-weight: bold; font-size: 18px;");
      } else if (this.levelComplete) {
        console.log("%cLevel Complete! Press SPACE for Level " + this.currentLevel + " | Score: " + this.totalScore, "color: green; font-weight: bold; font-size: 18px;");
      } else {
        if (!this.hasFocus) {
          console.log("%cClick on the page to gain control!", "color: orange; font-weight: bold; font-size: 18px; animation: blink 1s infinite;");
        } else if (this.currentRandomMessage) {
          console.log("%c" + this.currentRandomMessage, "color: magenta; font-weight: bold; font-size: 18px;");
        } else {
          console.log("%cLvl: " + this.currentLevel + " | Score: " + this.totalScore, "color: white; font-weight: bold; font-size: 18px;");
        }
      }
      this.needsRender = false;
    }

    checkCollision(aliens, playerPosition) {
      for (let y = this.PLAYER_ROW - 1; y >= 0; y--) {
        const hitAlien = aliens.find(alien => 
          alien.x === playerPosition && alien.y === y && !alien.isHit
        );
        if (hitAlien) {
          hitAlien.isHit = true;
          
          const pointsForKill = Math.floor(this.POINTS_PER_KILL * (1 + (this.currentLevel - 1) * this.SPEED_INCREASE_PER_LEVEL));
          this.totalScore += pointsForKill;
          this.needsRender = true;
          
          const remainingAliens = aliens.filter(a => !a.isHit);
          if (remainingAliens.length === 0) {
            this.createBigExplosion(hitAlien.x, hitAlien.y);
          } else {
            this.explosions.push({ x: playerPosition, y: y, timestamp: Date.now() });
          }
          break;
        }
      }
    }

    createBigExplosion(centerX, centerY) {
      const positions = [];
      const timestamp = Date.now();
      
      const pattern = [
        { x: 0, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
        { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
        { x: -2, y: 0 }, { x: 2, y: 0 }, { x: 0, y: -2 }, { x: 0, y: 2 },
        { x: -2, y: -1 }, { x: 2, y: 1 }, { x: -1, y: 2 }, { x: 1, y: -2 }
      ];
      
      pattern.forEach(offset => {
        const x = centerX + offset.x;
        const y = centerY + offset.y;
        if (x >= 0 && x < this.GAME_WIDTH && y >= 0 && y < this.GAME_HEIGHT) {
          positions.push({ x, y });
        }
      });
      
      this.bigExplosion = { positions, timestamp };
    }

    handlePlayerAction(playerAction) {
      if (!this.gameStarted && playerAction === 'shoot') {
        this.gameStarted = true;
        this.initializeGameState();
        return;
      }

      if (playerAction === 'pause' && !this.gameOver && !this.levelComplete && this.gameStarted) {
        this.togglePause();
        return;
      }

      if (this.gameOver && playerAction === 'shoot') {
        this.initializeGameState();
        return;
      }

      if (this.levelComplete && playerAction === 'shoot') {
        this.initializeGameState();
        return;
      }

      if (!this.gameStarted || this.isPaused || this.gameOver || this.levelComplete) return;

      switch (playerAction) {
        case 'moveLeft':
          this.playerPosition = Math.max(0, this.playerPosition - 1);
          this.needsRender = true;
          break;
        case 'moveRight':
          this.playerPosition = Math.min(this.GAME_WIDTH - 1, this.playerPosition + 1);
          this.needsRender = true;
          break;
        case 'shoot':
          if (!this.laserActive) {
            this.laserActive = true;
            this.checkCollision(this.aliens, this.playerPosition);
            this.needsRender = true;
            setTimeout(() => { 
              this.laserActive = false; 
              this.needsRender = true;
            }, 300);
          }
          break;
      }
    }

    togglePause() {
      this.isPaused = !this.isPaused;
      this.needsRender = true;
      
      if (this.isPaused) {
        clearInterval(this.alienMovementInterval);
      } else {
        this.alienMovementInterval = setInterval(() => this.updateAlienPositions(), this.getCurrentAlienSpeed());
      }
    }

    updateGame() {
      if (!this.gameStarted || this.isPaused || this.gameOver || this.levelComplete) {
        this.render();
        return;
      }

      this.render();
      this.aliens = this.aliens.filter(alien => !alien.isHit);

      const alienReachedBottom = this.aliens.some(alien => alien.y >= this.PLAYER_ROW);
      if (alienReachedBottom) {
        console.log('Game Over! Aliens reached Earth!');
        clearInterval(this.alienMovementInterval);
        this.currentLevel = 1; // Reset level on actual game over
        this.gameOver = true;
        this.needsRender = true;
        return;
      }

      if (this.aliens.length === 0) {
        this.currentLevel++;
        console.log('Level ' + (this.currentLevel - 1) + ' Complete!');
        clearInterval(this.alienMovementInterval);
        this.levelComplete = true;
        this.needsRender = true;
        return;
      }
    }

    updateAlienPositions() {
      if (this.aliens.length === 0) return;

      let hitBoundary = false;
      this.aliens.forEach(alien => {
        const nextX = alien.x + this.alienDirection;
        if (nextX < 0 || nextX >= this.GAME_WIDTH) {
          hitBoundary = true;
        }
      });

      if (hitBoundary) {
        this.aliens.forEach(alien => {
          alien.y += this.ALIEN_DROP_DISTANCE;
        });
        this.alienDirection *= -1;
      } else {
        this.aliens.forEach(alien => {
          alien.x += this.alienDirection;
        });
      }

      this.needsRender = true;
    }

    initializeGameState() {
      this.playerPosition = Math.floor(this.GAME_WIDTH / 2);
      this.laserActive = false;
      this.aliens = [];
      this.explosions = [];
      this.bigExplosion = null;
      this.alienDirection = 1;
      this.needsRender = true;
      this.isPaused = false;
      this.gameOver = false;
      this.levelComplete = false;
      this.gameStarted = true;
      // Note: totalScore and currentLevel are preserved when ESC is pressed

      clearInterval(this.gameInterval);
      clearInterval(this.alienMovementInterval);

      for (let row = 0; row < this.ALIEN_ROWS; row++) {
        const startPosition = row % 2 === 0 ? this.ALIEN_OFFSET : 1;
        for (let i = 0; i < this.ALIENS_PER_ROW; i++) {
          this.aliens.push({
            x: startPosition + i,
            y: row,
            isHit: false
          });
        }
      }

      this.gameInterval = setInterval(() => this.updateGame(), this.REFRESH_RATE);
      this.alienMovementInterval = setInterval(() => this.updateAlienPositions(), this.getCurrentAlienSpeed());
    }

    start() {
      console.log('Console Invaders loaded! Use arrow keys to move, spacebar to shoot, P to pause.');
      this.gameStarted = false;
      this.gameInterval = setInterval(() => this.updateGame(), this.REFRESH_RATE);
      this.render();
    }

    stop() {
      clearInterval(this.gameInterval);
      clearInterval(this.alienMovementInterval);
      console.clear();
    }
  }

  // Main Console Invaders Class
  class ConsoleInvaders {
    constructor() {
      this.game = null;
      this.keyListener = null;
      this.isActive = false;
    }

    start() {
      if (this.isActive) {
        console.log('Console Invaders is already running!');
        return;
      }

      this.game = new ConsoleInvadersEngine();
      this.isActive = true;
      
      this.keyListener = (event) => {
        if (!this.isActive) return;
        event.preventDefault();
        
        switch (event.key) {
          case 'ArrowLeft':
            this.game.handlePlayerAction('moveLeft');
            break;
          case 'ArrowRight':
            this.game.handlePlayerAction('moveRight');
            break;
          case ' ':
            this.game.handlePlayerAction('shoot');
            break;
          case 'p':
          case 'P':
            this.game.handlePlayerAction('pause');
            break;
          case 'Escape':
            this.stop();
            break;
        }
      };

      this.focusListener = () => {
        this.game.hasFocus = true;
        this.game.needsRender = true;
      };

      this.blurListener = () => {
        this.game.hasFocus = false;
        this.game.needsRender = true;
      };

      document.addEventListener('keydown', this.keyListener);
      window.addEventListener('focus', this.focusListener);
      window.addEventListener('blur', this.blurListener);
      this.game.start();
    }

    stop() {
      if (!this.isActive) return;
      
      this.isActive = false;
      if (this.game) {
        this.game.stop();
      }
      
      if (this.keyListener) {
        document.removeEventListener('keydown', this.keyListener);
        this.keyListener = null;
      }

      if (this.focusListener) {
        window.removeEventListener('focus', this.focusListener);
        this.focusListener = null;
      }

      if (this.blurListener) {
        window.removeEventListener('blur', this.blurListener);
        this.blurListener = null;
      }
      
      console.log('Console Invaders hidden. Type invaders() to play again!');
    }
  }

  // Create global instance
  const consoleInvaders = new ConsoleInvaders();

  // Auto-setup triggers - only console method
  function setupTriggers() {
    // Console methods only
    if (typeof window !== 'undefined') {
      window.invaders = () => consoleInvaders.start();
    }
    
    if (typeof console !== 'undefined') {
      console.invaders = () => consoleInvaders.start();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTriggers);
  } else {
    setupTriggers();
  }

  // Log availability
  console.log('Console Invaders ready! Type: invaders()');

  // Export for global access
  if (typeof window !== 'undefined') {
    window.ConsoleInvaders = consoleInvaders;
  }

})();