import React, { useState, useEffect, useRef, useCallback } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGamepad,
  faKeyboard,
  faPuzzlePiece,
  faFont
} from '@fortawesome/free-solid-svg-icons'

const Games = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [selectedGame, setSelectedGame] = useState(null)
  const gameContainerRef = useRef(null)
  const [gameKey, setGameKey] = useState(0) // Used to force remount of game components

  // Safely clear any timers or event handlers when needed
  const safeCleanup = useCallback(() => {
    try {
      // Clear any global timers that might exist
      window.gameTimers = window.gameTimers || [];
      window.gameTimers.forEach(timer => {
        if (timer) {
          clearTimeout(timer);
          clearInterval(timer);
        }
      });
      window.gameTimers = [];
      
      // Clear any global event listeners
      if (window.gameCleanupFunctions) {
        window.gameCleanupFunctions.forEach(cleanup => {
          if (typeof cleanup === 'function') {
            try {
              cleanup();
            } catch (e) {
              console.error("Error in cleanup function:", e);
            }
          }
        });
      }
      window.gameCleanupFunctions = [];
      
      // Reset any game elements that might cause issues
      if (window.gameOverElements) {
        window.gameOverElements.forEach(element => {
          try {
            if (element && element.parentNode) {
              element.parentNode.removeChild(element);
            }
          } catch (e) {
            console.error("Error removing game over element:", e);
          }
        });
      }
      window.gameOverElements = [];
    } catch (e) {
      console.error("Error in game cleanup:", e);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Initialize the selected game
  useEffect(() => {
    if (selectedGame && gameContainerRef.current) {
      // Reset any global game states
      window.gameTimers = window.gameTimers || [];
      window.gameCleanupFunctions = window.gameCleanupFunctions || [];
      window.gameOverElements = window.gameOverElements || [];
      
      // Clear container between game changes
      if (gameContainerRef.current) {
        gameContainerRef.current.innerHTML = '';
      }
      
      // Initialize the selected game
      const container = gameContainerRef.current;
      let cleanup = null;
      
      try {
        switch (selectedGame) {
          case 'hangman-game':
            cleanup = initHangmanGame(container);
            break;
          case 'tic-tac-toe':
            cleanup = initTicTacToeGame(container);
            break;
          case 'typing-speed-test':
            cleanup = initTypingSpeedTest(container);
            break;
          case 'snake-game':
            cleanup = initSnakeGame(container);
            break;
          default:
            break;
        }
        
        // Store any cleanup function for later use
        if (typeof cleanup === 'function') {
          window.gameCleanupFunctions.push(cleanup);
        }
      } catch (e) {
        console.error(`Error initializing game ${selectedGame}:`, e);
      }
      
      // Return cleanup function for React's useEffect
      return () => {
        safeCleanup();
      };
    }
  }, [selectedGame, gameKey, safeCleanup]);

  // Function to handle returning to the games list
  const handleBackToGames = () => {
    try {
      // Special handling for Snake game
      if (selectedGame === 'snake-game') {
        // Find and clear any game intervals that might be running
        const intervalIds = [];
        const maxIntervalId = setInterval(() => {}, 0);
        
        // Clear all possible intervals
        for (let i = 1; i <= maxIntervalId; i++) {
          clearInterval(i);
        }
        
        // Clear any game over containers
        if (gameContainerRef.current) {
          const gameOverContainers = gameContainerRef.current.querySelectorAll('.game-over-container');
          gameOverContainers.forEach(container => {
            container.innerHTML = '';
          });
        }
      }
      
      // Safely clean up any game resources first
      if (typeof window.currentGameCleanup === 'function') {
        window.currentGameCleanup();
        window.currentGameCleanup = null;
      }
      
      // Clear the container HTML after cleanup
      if (gameContainerRef.current) {
        gameContainerRef.current.innerHTML = '';
      }
      
      // Short delay before state update to ensure DOM is cleaned up
      setTimeout(() => {
        // Reset the selected game state - this will trigger the render of the games grid
        setSelectedGame(null);
      }, 50);
    } catch (error) {
      console.error("Error during back to games navigation:", error);
      // Force reset selected game even if there's an error
      setSelectedGame(null);
    }
  }

  // Game titles and descriptions
  const gameTitle = {
    'hangman-game': 'Hangman: Design & UX Terms',
    'tic-tac-toe': 'Tic-Tac-Toe',
    'typing-speed-test': 'Typing Speed Test',
    'snake-game': 'Snake Game'
  };

  const gameDescription = {
    'hangman-game': 'Guess the hidden design or UX term before you run out of attempts!',
    'tic-tac-toe': 'Classic X and O game. Play against the computer!',
    'typing-speed-test': 'Test your typing speed and accuracy with UX and design-related text.',
    'snake-game': 'Control the snake and collect food without crashing.'
  };

  // Function to run initialization after the component is fully mounted
  const safeInitGame = (game, container) => {
    // Use a small delay to ensure the container is fully in the DOM
    const timer = setTimeout(() => {
      try {
        switch (game) {
          case 'hangman-game':
            initHangmanGame(container);
            break;
          case 'tic-tac-toe':
            initTicTacToeGame(container);
            break;
          case 'typing-speed-test':
            initTypingSpeedTest(container);
            break;
          case 'snake-game':
            initSnakeGame(container);
            break;
          default:
            break;
        }
      } catch (e) {
        console.error(`Error re-initializing game ${game}:`, e);
      }
    }, 50);
    
    // Store this timer for cleanup
    window.gameTimers.push(timer);
  };

  // Update Snake game to ensure proper cleanup
  function initSnakeGame(container) {
    const gameArea = document.createElement('div')
    gameArea.className = 'snake-container'
    container.appendChild(gameArea)
    
    const infoDiv = document.createElement('div')
    infoDiv.className = 'game-info'
    infoDiv.innerHTML = '<h3>Snake Game</h3><p>Use arrow keys to move the snake. Collect the red food without hitting walls or yourself!</p>'
    gameArea.appendChild(infoDiv)
    
    // Create game layout container for side-by-side display
    const gameLayoutDiv = document.createElement('div')
    gameLayoutDiv.className = 'snake-game-layout'
    gameArea.appendChild(gameLayoutDiv)
    
    // Create canvas container
    const canvasContainer = document.createElement('div')
    canvasContainer.className = 'canvas-container'
    gameLayoutDiv.appendChild(canvasContainer)
    
    // Create score display
    const scoreDiv = document.createElement('div')
    scoreDiv.className = 'snake-score'
    scoreDiv.innerText = 'Score: 0'
    canvasContainer.appendChild(scoreDiv)
    
    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    canvas.className = 'snake-canvas'
    canvasContainer.appendChild(canvas)
    
    // Create controls container
    const controlsContainer = document.createElement('div')
    controlsContainer.className = 'controls-container'
    gameLayoutDiv.appendChild(controlsContainer)
    
    // Create game controls
    const controlsDiv = document.createElement('div')
    controlsDiv.className = 'game-controls'
    controlsContainer.appendChild(controlsDiv)
    
    const upBtn = document.createElement('button')
    upBtn.innerHTML = '&#8593;'
    upBtn.className = 'control-btn up-btn'
    
    const leftBtn = document.createElement('button')
    leftBtn.innerHTML = '&#8592;'
    leftBtn.className = 'control-btn left-btn'
    
    const rightBtn = document.createElement('button')
    rightBtn.innerHTML = '&#8594;'
    rightBtn.className = 'control-btn right-btn'
    
    const downBtn = document.createElement('button')
    downBtn.innerHTML = '&#8595;'
    downBtn.className = 'control-btn down-btn'
    
    // Add buttons to controls in D-pad layout
    controlsDiv.appendChild(upBtn)
    controlsDiv.appendChild(document.createElement('br'))
    controlsDiv.appendChild(leftBtn)
    controlsDiv.appendChild(rightBtn)
    controlsDiv.appendChild(document.createElement('br'))
    controlsDiv.appendChild(downBtn)
    
    // Create game buttons
    const gameButtonsDiv = document.createElement('div')
    gameButtonsDiv.className = 'game-buttons'
    controlsContainer.appendChild(gameButtonsDiv)
    
    const pauseResumeBtn = document.createElement('button')
    pauseResumeBtn.className = 'pause-button'
    pauseResumeBtn.innerText = 'Pause'
    gameButtonsDiv.appendChild(pauseResumeBtn)
    
    const restartBtn = document.createElement('button')
    restartBtn.className = 'restart-button'
    restartBtn.innerText = 'Restart'
    gameButtonsDiv.appendChild(restartBtn)
    
    // Create a dedicated container for game over message
    const gameOverContainer = document.createElement('div')
    gameOverContainer.className = 'game-over-container'
    gameArea.appendChild(gameOverContainer)
    
    // Game variables
    const ctx = canvas.getContext('2d')
    const box = 20
    let snake = [{ x: 9*box, y: 10*box }]
    let direction = 'RIGHT'
    let score = 0
    let food = randomFood()
    let game
    let isPaused = false
    let gameOverElement = null
    
    function randomFood() {
      return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
      }
    }
    
    // Add event listeners
    upBtn.onclick = () => { if (direction !== 'DOWN') direction = 'UP' }
    leftBtn.onclick = () => { if (direction !== 'RIGHT') direction = 'LEFT' }
    rightBtn.onclick = () => { if (direction !== 'LEFT') direction = 'RIGHT' }
    downBtn.onclick = () => { if (direction !== 'UP') direction = 'DOWN' }
    
    pauseResumeBtn.onclick = () => {
      if (isPaused) {
        game = setInterval(draw, 150)
        pauseResumeBtn.innerText = 'Pause'
      } else {
        clearInterval(game)
        pauseResumeBtn.innerText = 'Resume'
      }
      isPaused = !isPaused
    }
    
    restartBtn.onclick = () => {
      snake = [{ x: 9*box, y: 10*box }]
      direction = 'RIGHT'
      score = 0
      food = randomFood()
      scoreDiv.innerText = 'Score: 0'
      
      // Remove game over message if present
      if (gameOverElement) {
        try {
          // Clear the game over container instead of removing the element
          gameOverContainer.innerHTML = ''
          gameOverElement = null
        } catch (e) {
          console.log("Couldn't clear game over container:", e);
        }
      }
      
      if (isPaused) {
        isPaused = false
        pauseResumeBtn.innerText = 'Pause'
      }
      
      clearInterval(game)
      game = setInterval(draw, 150)
    }
    
    // Add keyboard controls
    function handleKeyDown(e) {
      if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP'
      else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN'
      else if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT'
      else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT'
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    function draw() {
      // Clear canvas
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw snake
      for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#4CAF50' : '#8BC34A'
        ctx.fillRect(snake[i].x, snake[i].y, box, box)
        
        ctx.strokeStyle = 'black'
        ctx.strokeRect(snake[i].x, snake[i].y, box, box)
      }
      
      // Draw food
      ctx.fillStyle = '#FF5252'
      ctx.fillRect(food.x, food.y, box, box)
      
      // Calculate new head position
      let snakeX = snake[0].x
      let snakeY = snake[0].y
      
      if (direction === 'UP') snakeY -= box
      if (direction === 'DOWN') snakeY += box
      if (direction === 'LEFT') snakeX -= box
      if (direction === 'RIGHT') snakeX += box
      
      // Check if snake eats food
      if (snakeX === food.x && snakeY === food.y) {
        score++
        scoreDiv.innerText = `Score: ${score}`
        food = randomFood()
      } else {
        // Remove tail
        snake.pop()
      }
      
      // Create new head
      const newHead = {
        x: snakeX,
        y: snakeY
      }
      
      // Game over conditions
      const hitLeftWall = snakeX < 0
      const hitRightWall = snakeX >= canvas.width
      const hitTopWall = snakeY < 0
      const hitBottomWall = snakeY >= canvas.height
      
      // Check if snake hit itself
      let collision = false
      for (let i = 0; i < snake.length; i++) {
        if (snakeX === snake[i].x && snakeY === snake[i].y) {
          collision = true
          break
        }
      }
      
      if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || collision) {
        clearInterval(game)
        
        // Create game over message
        // Clear previous game over message if it exists
        gameOverContainer.innerHTML = ''
        
        const gameOverDiv = document.createElement('div')
        gameOverDiv.className = 'game-over'
        gameOverDiv.innerHTML = `<h3>Game Over!</h3><p>Your score: ${score}</p>`
        gameOverElement = gameOverDiv
        
        const playAgainBtn = document.createElement('button')
        playAgainBtn.innerText = 'Play Again'
        playAgainBtn.onclick = () => {
          // Clear game over container instead of removing the element
          gameOverContainer.innerHTML = ''
          gameOverElement = null
          
          snake = [{ x: 9*box, y: 10*box }]
          direction = 'RIGHT'
          score = 0
          food = randomFood()
          scoreDiv.innerText = 'Score: 0'
          game = setInterval(draw, 150)
        }
        
        gameOverDiv.appendChild(playAgainBtn)
        
        // Add the game over message to its dedicated container
        gameOverContainer.appendChild(gameOverDiv)
        
        return
      }
      
      // Add new head
      snake.unshift(newHead)
    }
    
    // Start the game
    game = setInterval(draw, 150)
    
    // Snake Game cleanup function
    return () => {
      try {
        // Remove event listener
        window.removeEventListener('keydown', handleKeyDown)
        
        // Clear game interval
        if (game) {
          clearInterval(game)
          game = null
        }
        
        // Clear game over container instead of trying to remove elements
        if (gameOverContainer) {
          gameOverContainer.innerHTML = ''
        }
        
        // Null references to help garbage collection
        gameOverElement = null
      } catch (error) {
        console.error("Error during Snake game cleanup:", error)
      }
    }
  }

  // Hangman Game implementation
  function initHangmanGame(container) {
    // Design and UX related words for the game
    const words = [
      'ACCESSIBILITY', 'USABILITY', 'RESPONSIVE', 'WIREFRAME', 'PROTOTYPE',
      'TYPOGRAPHY', 'INTERFACE', 'HIERARCHY', 'CONTRAST', 'ALIGNMENT',
      'CONSISTENCY', 'HEURISTIC', 'ITERATION', 'WHITESPACE', 'AFFORDANCE',
      'ANIMATION', 'BREAKPOINT', 'COMPONENT', 'FEEDBACK', 'PAGINATION',
      'NAVIGATION', 'VIEWPORT', 'WORKFLOW', 'USERFLOW', 'PERSONA',
      'STORYBOARD', 'VALIDATION', 'GESTURE', 'CONVERSION', 'FRAMEWORK'
    ]
    
    // Create game container
    const gameArea = document.createElement('div')
    gameArea.className = 'hangman-container'
    container.appendChild(gameArea)
    
    // Add game info
    const infoDiv = document.createElement('div')
    infoDiv.className = 'game-info'
    infoDiv.innerHTML = '<h3>Hangman: Design & UX Terms</h3><p>Guess the hidden design or UX term before you run out of attempts!</p>'
    gameArea.appendChild(infoDiv)
    
    // Create hangman display
    const hangmanDisplay = document.createElement('div')
    hangmanDisplay.className = 'hangman-display'
    gameArea.appendChild(hangmanDisplay)
    
    // Create hangman stand
    const hangmanStand = document.createElement('div')
    hangmanStand.className = 'hangman-stand'
    hangmanDisplay.appendChild(hangmanStand)
    
    // Create stand parts
    const topBar = document.createElement('div')
    topBar.className = 'top-bar'
    hangmanStand.appendChild(topBar)
    
    const verticalBar = document.createElement('div')
    verticalBar.className = 'vertical-bar'
    hangmanStand.appendChild(verticalBar)
    
    const bottomBar = document.createElement('div')
    bottomBar.className = 'bottom-bar'
    hangmanStand.appendChild(bottomBar)
    
    // Create hangman body parts (hidden initially)
    const bodyParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg']
    const bodyPartElements = bodyParts.map(part => {
      const element = document.createElement('div')
      if (part === 'head') {
        element.className = part
      } else if (part.includes('arm')) {
        element.className = `arm ${part}`
      } else if (part.includes('leg')) {
        element.className = `leg ${part}`
      } else {
        element.className = part
      }
      element.style.display = 'none'
      hangmanStand.appendChild(element)
      return element
    })
    
    // Create word display
    const wordDisplay = document.createElement('div')
    wordDisplay.className = 'word-display'
    gameArea.appendChild(wordDisplay)
    
    // Create keyboard
    const keyboard = document.createElement('div')
    keyboard.className = 'keyboard'
    gameArea.appendChild(keyboard)
    
    // Create status message
    const statusMessage = document.createElement('div')
    statusMessage.className = 'status-message'
    gameArea.appendChild(statusMessage)
    
    // Create restart button (hidden initially)
    const restartButton = document.createElement('button')
    restartButton.className = 'restart-button'
    restartButton.textContent = 'Play Again'
    restartButton.style.display = 'none'
    gameArea.appendChild(restartButton)
    
    // Game variables
    let selectedWord = ''
    let guessedLetters = []
    let wrongGuesses = 0
    let gameOver = false
    
    // Initialize game
    function initGame() {
      // Reset game state
      selectedWord = words[Math.floor(Math.random() * words.length)]
      guessedLetters = []
      wrongGuesses = 0
      gameOver = false
      
      // Reset UI
      statusMessage.textContent = ''
      statusMessage.className = 'status-message'
      restartButton.style.display = 'none'
      
      // Reset hangman
      bodyPartElements.forEach(part => {
        part.style.display = 'none'
      })
      
      // Create keyboard
      keyboard.innerHTML = ''
      
      for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i)
        const button = document.createElement('button')
        button.className = 'key'
        button.textContent = letter
        button.addEventListener('click', () => handleGuess(letter))
        keyboard.appendChild(button)
      }
      
      // Update word display
      updateWordDisplay()
    }
    
    // Handle letter guess
    function handleGuess(letter) {
      if (gameOver || guessedLetters.includes(letter)) return
      
      guessedLetters.push(letter)
      
      // Find button and disable it
      const buttons = keyboard.querySelectorAll('.key')
      buttons.forEach(button => {
        if (button.textContent === letter) {
          button.disabled = true
          if (selectedWord.includes(letter)) {
            button.classList.add('correct')
          } else {
            button.classList.add('wrong')
          }
        }
      })
      
      // Check if letter is in word
      if (!selectedWord.includes(letter)) {
        wrongGuesses++
        
        // Show body part
        if (wrongGuesses <= bodyPartElements.length) {
          bodyPartElements[wrongGuesses - 1].style.display = 'block'
        }
        
        // Check for game over (loss)
        if (wrongGuesses >= bodyPartElements.length) {
          endGame(false)
        }
      }
      
      // Update word display
      updateWordDisplay()
      
      // Check for win
      checkWin()
    }
    
    // Update word display
    function updateWordDisplay() {
      wordDisplay.innerHTML = ''
      
      selectedWord.split('').forEach(letter => {
        const letterSpan = document.createElement('div')
        letterSpan.className = 'letter'
        
        if (guessedLetters.includes(letter)) {
          letterSpan.textContent = letter
        } else {
          letterSpan.textContent = ''
        }
        
        wordDisplay.appendChild(letterSpan)
      })
    }
    
    // Check for win
    function checkWin() {
      const isWin = selectedWord.split('').every(letter => guessedLetters.includes(letter))
      
      if (isWin) {
        endGame(true)
      }
    }
    
    // End game
    function endGame(isWin) {
      gameOver = true
      
      if (isWin) {
        statusMessage.textContent = 'You won! 🎉'
        statusMessage.className = 'status-message win'
      } else {
        statusMessage.textContent = `You lost! The word was: ${selectedWord}`
        statusMessage.className = 'status-message lose'
      }
      
      restartButton.style.display = 'inline-block'
    }
    
    // Handle restart
    restartButton.addEventListener('click', initGame)
    
    // Handle keyboard input
    function handleKeyDown(e) {
      if (gameOver) return
      
      const key = e.key.toUpperCase()
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    // Initialize game
    initGame()
    
    // Return cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }

  // Tic-Tac-Toe Game implementation
  function initTicTacToeGame(container) {
    // Create game container
    const gameArea = document.createElement('div')
    gameArea.className = 'tictactoe-container'
    container.appendChild(gameArea)
    
    // Add game info
    const infoDiv = document.createElement('div')
    infoDiv.className = 'game-info'
    infoDiv.innerHTML = '<h3>Tic-Tac-Toe</h3><p>Classic X and O game. Play against the computer with varying difficulty levels!</p>'
    gameArea.appendChild(infoDiv)
    
    // Create difficulty selector
    const difficultyContainer = document.createElement('div')
    difficultyContainer.className = 'difficulty-container'
    gameArea.appendChild(difficultyContainer)
    
    const difficultyLabel = document.createElement('label')
    difficultyLabel.textContent = 'Difficulty: '
    difficultyContainer.appendChild(difficultyLabel)
    
    const difficultySelect = document.createElement('select')
    difficultySelect.className = 'difficulty-select'
    difficultyContainer.appendChild(difficultySelect)
    
    const difficulties = ['Easy', 'Medium', 'Hard', 'Impossible']
    difficulties.forEach(difficulty => {
      const option = document.createElement('option')
      option.value = difficulty.toLowerCase()
      option.textContent = difficulty
      difficultySelect.appendChild(option)
    })
    
    // Create game board
    const boardContainer = document.createElement('div')
    boardContainer.className = 'tictactoe-board'
    gameArea.appendChild(boardContainer)
    
    // Create cells for the board
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div')
      cell.className = 'cell'
      cell.dataset.index = i
      boardContainer.appendChild(cell)
    }
    
    // Create game status
    const gameStatus = document.createElement('div')
    gameStatus.className = 'game-status'
    gameStatus.textContent = 'Your turn (X)'
    gameArea.appendChild(gameStatus)
    
    // Create restart button
    const restartButton = document.createElement('button')
    restartButton.className = 'restart-button'
    restartButton.textContent = 'Restart Game'
    gameArea.appendChild(restartButton)
    
    // Game variables
    let board = ['', '', '', '', '', '', '', '']
    let currentPlayer = 'X'
    let gameActive = true
    let computerThinking = false
    
    // Get all cells
    const cells = boardContainer.querySelectorAll('.cell')
    
    // Handle cell click
    function handleCellClick(e) {
      const cell = e.target
      const index = parseInt(cell.dataset.index)
      
      // Check if cell is already filled or game is over or computer is thinking
      if (board[index] !== '' || !gameActive || computerThinking) return
      
      // Make player move
      makeMove(index, 'X')
      
      // Computer's turn
      if (gameActive) {
        computerTurn()
      }
    }
    
    // Make a move
    function makeMove(index, player) {
      board[index] = player
      cells[index].textContent = player
      cells[index].classList.add(player.toLowerCase())
      
      // Check for game end
      if (checkWin(player)) {
        gameStatus.textContent = player === 'X' ? 'You win!' : 'Computer wins!'
        gameStatus.className = 'game-status win'
        gameActive = false
        return
      }
      
      if (checkDraw()) {
        gameStatus.textContent = 'Game ended in a draw!'
        gameStatus.className = 'game-status draw'
        gameActive = false
        return
      }
      
      // Switch player
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
      if (gameActive) {
        gameStatus.textContent = currentPlayer === 'X' ? 'Your turn (X)' : 'Computer thinking...'
      }
    }
    
    // Computer's turn
    function computerTurn() {
      if (!gameActive) return
      
      computerThinking = true
      gameStatus.textContent = 'Computer thinking...'
      
      // Add a small delay to make it seem like the computer is thinking
      setTimeout(() => {
        const difficulty = difficultySelect.value
        let move
        
        switch (difficulty) {
          case 'easy':
            move = getRandomMove()
            break
          case 'medium':
            // 50% chance of making a smart move
            move = Math.random() < 0.5 ? getBestMove(1) : getRandomMove()
            break
          case 'hard':
            // 80% chance of making a smart move
            move = Math.random() < 0.8 ? getBestMove(2) : getRandomMove()
            break
          case 'impossible':
            move = getBestMove(3) // Full minimax
            break
          default:
            move = getRandomMove()
        }
        
        if (move !== null) {
          makeMove(move, 'O')
        }
        
        computerThinking = false
      }, 700)
    }
    
    // Get a random valid move
    function getRandomMove() {
      const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(cell => cell !== null)
      
      if (availableMoves.length === 0) return null
      
      return availableMoves[Math.floor(Math.random() * availableMoves.length)]
    }
    
    // Get best move using minimax algorithm
    function getBestMove(depth) {
      // For first move in impossible, do something smart instead of corner every time
      if (board.every(cell => cell === '')) {
        const options = [0, 2, 6, 8, 4] // Corners and center
        return options[Math.floor(Math.random() * options.length)]
      }
      
      let bestScore = -Infinity
      let bestMove = null
      
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O'
          let score = minimax(board, depth, false, -Infinity, Infinity)
          board[i] = ''
          
          if (score > bestScore) {
            bestScore = score
            bestMove = i
          }
        }
      }
      
      return bestMove
    }
    
    // Minimax algorithm with alpha-beta pruning
    function minimax(board, depth, isMaximizing, alpha, beta) {
      // Check for terminal states
      if (checkWin('O')) return 10
      if (checkWin('X')) return -10
      if (checkDraw()) return 0
      if (depth === 0) return evaluateBoard(board)
      
      if (isMaximizing) {
        let bestScore = -Infinity
        
        for (let i = 0; i < board.length; i++) {
          if (board[i] === '') {
            board[i] = 'O'
            let score = minimax(board, depth - 1, false, alpha, beta)
            board[i] = ''
            
            bestScore = Math.max(bestScore, score)
            alpha = Math.max(alpha, bestScore)
            
            if (beta <= alpha) break // Alpha-beta pruning
          }
        }
        
        return bestScore
      } else {
        let bestScore = Infinity
        
        for (let i = 0; i < board.length; i++) {
          if (board[i] === '') {
            board[i] = 'X'
            let score = minimax(board, depth - 1, true, alpha, beta)
            board[i] = ''
            
            bestScore = Math.min(bestScore, score)
            beta = Math.min(beta, bestScore)
            
            if (beta <= alpha) break // Alpha-beta pruning
          }
        }
        
        return bestScore
      }
    }
    
    // Simple board evaluation for limited-depth minimax
    function evaluateBoard(board) {
      // Check rows, columns, and diagonals for potential wins
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ]
      
      let score = 0
      
      for (const line of lines) {
        const [a, b, c] = line
        const countO = [board[a], board[b], board[c]].filter(cell => cell === 'O').length
        const countX = [board[a], board[b], board[c]].filter(cell => cell === 'X').length
        const countEmpty = [board[a], board[b], board[c]].filter(cell => cell === '').length
        
        // Score based on potential
        if (countO === 2 && countEmpty === 1) score += 5
        if (countX === 2 && countEmpty === 1) score -= 5
        if (countO === 1 && countEmpty === 2) score += 1
        if (countX === 1 && countEmpty === 2) score -= 1
        
        // Bonus for center
        if (board[4] === 'O') score += 3
        if (board[4] === 'X') score -= 3
      }
      
      return score
    }
    
    // Check for win
    function checkWin(player) {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ]
      
      return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === player)
      })
    }
    
    // Check for draw
    function checkDraw() {
      return !board.includes('')
    }
    
    // Restart game
    function restartGame() {
      board = ['', '', '', '', '', '', '', '', '']
      currentPlayer = 'X'
      gameActive = true
      computerThinking = false
      
      // Reset UI
      cells.forEach(cell => {
        cell.textContent = ''
        cell.className = 'cell'
      })
      
      gameStatus.textContent = 'Your turn (X)'
      gameStatus.className = 'game-status'
      
      // If first turn is computer's, make a move
      if (currentPlayer === 'O') {
        computerTurn()
      }
    }
    
    // Add event listeners
    cells.forEach(cell => {
      cell.addEventListener('click', handleCellClick)
    })
    
    restartButton.addEventListener('click', restartGame)
    
    difficultySelect.addEventListener('change', restartGame)
    
    // Start the game
    // Initialize game
    restartGame()
    
    // Return cleanup function
    return () => {
      cells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick)
      })
      restartButton.removeEventListener('click', restartGame)
      difficultySelect.removeEventListener('change', restartGame)
    }
  }

  // Typing Speed Test implementation
  function initTypingSpeedTest(container) {
    // UX and design related text samples
    const textSamples = [
      "User experience design is the process of enhancing user satisfaction by improving the usability, accessibility, and pleasure provided in the interaction with a product.",
      "The principle of consistency in design establishes patterns in language, layout, and design elements throughout the interface to help users learn and use the system better.",
      "Good typography enhances readability, establishes hierarchy, and contributes to the mood of a design while maintaining optimal legibility for users.",
      "Responsive web design is an approach that makes web pages render well on a variety of devices and window or screen sizes, ensuring a seamless user experience.",
      "Visual hierarchy helps users understand what to look at first and where to go next, guiding them through content and interface elements based on their importance.",
      "Whitespace, also known as negative space, is the empty area between elements in a composition, used to create breathing room and improve focus on key elements.",
      "Accessibility in design ensures that products, services, and environments are usable by people with disabilities, following principles like perceivable, operable, understandable, and robust.",
      "Color theory in UX design involves using colors strategically to enhance usability, evoke emotions, and reinforce brand identity while ensuring proper contrast.",
      "Interaction design focuses on creating engaging interfaces with well-thought-out behaviors, defining how users interact with the system and how the system responds.",
      "User testing involves evaluating a product by testing it with representative users, helping designers identify usability problems and areas for improvement."
    ]
    
    // Create game container
    const gameArea = document.createElement('div')
    gameArea.className = 'typing-test-container'
    container.appendChild(gameArea)
    
    // Add game info
    const infoDiv = document.createElement('div')
    infoDiv.className = 'game-info'
    infoDiv.innerHTML = '<h3>Typing Speed Test</h3><p>Test your typing speed and accuracy with UX and design-related text.</p>'
    gameArea.appendChild(infoDiv)
    
    // Create text display
    const textDisplay = document.createElement('div')
    textDisplay.className = 'text-display'
    gameArea.appendChild(textDisplay)
    
    // Create input area
    const inputArea = document.createElement('div')
    inputArea.className = 'input-area'
    gameArea.appendChild(inputArea)
    
    const textInput = document.createElement('textarea')
    textInput.className = 'text-input'
    textInput.disabled = true
    textInput.placeholder = 'Start the test first, then type the text above here...'
    inputArea.appendChild(textInput)
    
    // Create stats display
    const statsDisplay = document.createElement('div')
    statsDisplay.className = 'stats-display'
    gameArea.appendChild(statsDisplay)
    
    const timeDisplay = document.createElement('div')
    timeDisplay.className = 'time'
    timeDisplay.textContent = 'Time: 60s'
    statsDisplay.appendChild(timeDisplay)
    
    const wpmDisplay = document.createElement('div')
    wpmDisplay.className = 'wpm'
    wpmDisplay.textContent = 'WPM: 0'
    statsDisplay.appendChild(wpmDisplay)
    
    const accuracyDisplay = document.createElement('div')
    accuracyDisplay.className = 'accuracy'
    accuracyDisplay.textContent = 'Accuracy: 0%'
    statsDisplay.appendChild(accuracyDisplay)
    
    // Create button container
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'button-container'
    gameArea.appendChild(buttonContainer)
    
    const startButton = document.createElement('button')
    startButton.className = 'start-button'
    startButton.textContent = 'Start Test'
    buttonContainer.appendChild(startButton)
    
    // Game variables
    let currentText = ''
    let typedCharacters = 0
    let correctCharacters = 0
    let startTime = null
    let timerInterval = null
    let timeLeft = 60
    let testActive = false
    
    // Initialize text display
    function initializeTextDisplay(text) {
      textDisplay.innerHTML = ''
      currentText = text
      
      text.split('').forEach(char => {
        const span = document.createElement('span')
        span.textContent = char
        textDisplay.appendChild(span)
      })
    }
    
    // Start the test
    function startTest() {
      // Reset variables
      typedCharacters = 0
      correctCharacters = 0
      timeLeft = 60
      testActive = true
      
      // Get random text sample
      const randomText = textSamples[Math.floor(Math.random() * textSamples.length)]
      initializeTextDisplay(randomText)
      
      // Enable input
      textInput.disabled = false
      textInput.value = ''
      textInput.focus()
      
      // Start timer
      startTime = Date.now()
      timerInterval = setInterval(updateTimer, 1000)
      
      // Change button
      startButton.textContent = 'Restart Test'
      
      // Update displays
      updateStats()
    }
    
    // Update timer
    function updateTimer() {
      timeLeft--
      timeDisplay.textContent = `Time: ${timeLeft}s`
      
      if (timeLeft <= 0) {
        endTest()
      }
    }
    
    // Update typing stats
    function updateStats() {
      if (!testActive) return
      
      // Calculate WPM (assuming 5 characters per word)
      const elapsedMinutes = (Date.now() - startTime) / 60000
      const wpm = Math.round((typedCharacters / 5) / elapsedMinutes) || 0
      
      // Calculate accuracy
      const accuracy = typedCharacters > 0 ? Math.round((correctCharacters / typedCharacters) * 100) : 0
      
      // Update displays
      wpmDisplay.textContent = `WPM: ${wpm}`
      accuracyDisplay.textContent = `Accuracy: ${accuracy}%`
      
      // Add classes for styling
      if (wpm > 60) {
        wpmDisplay.className = 'wpm good-result'
      } else if (wpm > 40) {
        wpmDisplay.className = 'wpm average-result'
      } else {
        wpmDisplay.className = 'wpm poor-result'
      }
    }
    
    // Handle input
    function handleInput() {
      if (!testActive) return
      
      const inputText = textInput.value
      typedCharacters = inputText.length
      correctCharacters = 0
      
      // Check each character
      const textChars = textDisplay.querySelectorAll('span')
      for (let i = 0; i < textChars.length; i++) {
        if (i < inputText.length) {
          if (inputText[i] === textChars[i].textContent) {
            textChars[i].className = 'correct'
            correctCharacters++
          } else {
            textChars[i].className = 'incorrect'
          }
        } else {
          textChars[i].className = ''
        }
      }
      
      // Update stats
      updateStats()
      
      // Check if test is complete
      if (inputText.length >= currentText.length) {
        endTest()
      }
    }
    
    // End the test
    function endTest() {
      testActive = false
      clearInterval(timerInterval)
      
      // Disable input
      textInput.disabled = true
      
      // Calculate final stats
      const elapsedMinutes = ((Date.now() - startTime) / 60000) || (60 - timeLeft) / 60
      const wpm = Math.round((typedCharacters / 5) / elapsedMinutes) || 0
      const accuracy = typedCharacters > 0 ? Math.round((correctCharacters / typedCharacters) * 100) : 0
      
      // Update displays
      timeDisplay.textContent = 'Time: 0s'
      wpmDisplay.textContent = `WPM: ${wpm}`
      accuracyDisplay.textContent = `Accuracy: ${accuracy}%`
      
      // Add message to text display
      const resultMessage = document.createElement('p')
      resultMessage.innerHTML = `<strong>Test Complete!</strong><br>Your typing speed is ${wpm} WPM with ${accuracy}% accuracy.`
      
      // Clear previous content and show result
      textDisplay.innerHTML = ''
      textDisplay.appendChild(resultMessage)
    }
    
    // Add event listeners
    startButton.addEventListener('click', () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
      startTest()
    })
    
    textInput.addEventListener('input', handleInput)
    
    // Initialize with a random text (but don't start test yet)
    const initialText = textSamples[Math.floor(Math.random() * textSamples.length)]
    initializeTextDisplay(initialText)
    
    // Return cleanup function
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
      startButton.removeEventListener('click', startTest)
      textInput.removeEventListener('input', handleInput)
    }
  }

  // Render the content for the selected game
  const renderGameContent = () => {
    if (!selectedGame) return null;

    return (
      <div className="game-content" key={`game-content-${gameKey}`}>
        <h2>{gameTitle[selectedGame]}</h2>
        <p>{gameDescription[selectedGame]}</p>
        
        <div 
          className="game-container" 
          ref={gameContainerRef} 
          key={`game-container-${gameKey}`}
          data-game={selectedGame}
        ></div>
        
        <button 
          className="back-button" 
          onClick={handleBackToGames}
        >
          Back to Games
        </button>
      </div>
    );
  };

  return (
    <div className="container games-page" key={`games-page-${gameKey}`}>
      <div className="text-zone">
        <h1>
          <AnimatedLetters
            letterClass={letterClass}
            strArray={['G', 'a', 'm', 'e', 's']}
            idx={15}
          />
        </h1>
        <p>
          Take a break and have some fun with these design and UX-related games. 
          Challenge yourself, learn something new, and enjoy the experience!
        </p>
      </div>

      {!selectedGame ? (
        <div className="games-grid">
          <div 
            className="game-card" 
            onClick={() => {
              safeCleanup();
              setGameKey(prev => prev + 1);
              setSelectedGame('hangman-game');
            }}
          >
            <FontAwesomeIcon icon={faFont} className="game-icon" />
            <h2>Hangman</h2>
            <p>Guess design & UX terms letter by letter</p>
          </div>

          <div 
            className="game-card" 
            onClick={() => {
              safeCleanup();
              setGameKey(prev => prev + 1);
              setSelectedGame('tic-tac-toe');
            }}
          >
            <FontAwesomeIcon icon={faPuzzlePiece} className="game-icon" />
            <h2>Tic-Tac-Toe</h2>
            <p>Classic X and O game against the computer</p>
          </div>

          <div 
            className="game-card" 
            onClick={() => {
              safeCleanup();
              setGameKey(prev => prev + 1);
              setSelectedGame('typing-speed-test');
            }}
          >
            <FontAwesomeIcon icon={faKeyboard} className="game-icon" />
            <h2>Typing Speed Test</h2>
            <p>Measure your WPM and typing accuracy</p>
          </div>

          <div 
            className="game-card" 
            onClick={() => {
              safeCleanup();
              setGameKey(prev => prev + 1);
              setSelectedGame('snake-game');
            }}
          >
            <FontAwesomeIcon icon={faGamepad} className="game-icon" />
            <h2>Snake Game</h2>
            <p>Control the snake and grow without crashing</p>
          </div>
        </div>
      ) : (
        renderGameContent()
      )}
      
      <Loader type="pacman" />
    </div>
  )
}

export default Games 