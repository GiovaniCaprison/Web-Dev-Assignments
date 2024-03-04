// Define UI elements
const uiElements = {
  highScoreNode: document.getElementById("highScore"),
  currentScoreNode: document.getElementById("currScore"),
  controlButton: document.getElementById("controlButton"),
  gameStateMenu: document.getElementById("menu"),
  allButtons: document.querySelectorAll(".buttons"),
};

// Game state variables
let state = {
  highScore: 0,
  currentScore: 0,
  sequence: [],
  userSequenceIndex: 0,
  gameActive: false,
  sequenceActive: false,
  timeout: null,
  intervalSpeed: 1000, // milliseconds
};

// Initialize game
function init() {
  uiElements.controlButton.addEventListener("click", toggleGame);
}

// Toggle game on/off
function toggleGame() {
  state.gameActive = !state.gameActive;
  if (state.gameActive) {
    startGame();
  } else {
    resetGame();
  }
}

// Start the game
function startGame() {
  state.gameActive = true;
  state.currentScore = 0;
  updateScoreDisplay();
  uiElements.gameStateMenu.classList.add("game-on");
  generateSequence();
}

// Generate and display the next sequence
function generateSequence() {
  state.sequence.push(Math.floor(Math.random() * 4)); // Generate a number between 0 and 3
  state.userSequenceIndex = 0;
  displaySequence();
}

// Display the sequence to the user
function displaySequence() {
  let index = 0;
  state.sequenceActive = true;
  const interval = setInterval(() => {
    if (index >= state.sequence.length) {
      clearInterval(interval);
      state.sequenceActive = false;
      return;
    }
    flashButton(state.sequence[index]);
    index++;
  }, state.intervalSpeed);
}

// Flash a button in the sequence
function flashButton(index) {
  const button = uiElements.allButtons[index];
  button.classList.add("on");
  setTimeout(() => button.classList.remove("on"), 500);
}

// Update the score display
function updateScoreDisplay() {
  uiElements.currentScoreNode.innerText = state.currentScore.toString().padStart(2, '0');
}

// Check user's input against the sequence
async function checkUserInput(index) {
  if (!state.sequenceActive && state.gameActive) {
    if (state.sequence[state.userSequenceIndex] === index) {
      state.userSequenceIndex++;
      if (state.userSequenceIndex === state.sequence.length) {
        state.currentScore++;
        updateScoreDisplay();
        generateSequence();
      }
    } else {
      state.highScore = Math.max(state.currentScore, state.highScore);
      await delay(150);
      await gameOverSequence();
    }
  }
}

// Utility function to create a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Flash all buttons 5 times and set high score if applicable
async function gameOverSequence() {
  for (let i = 0; i < 5; i++) {
    uiElements.allButtons.forEach(button => {
      button.classList.add("on");
    });
    await delay(200);
    uiElements.allButtons.forEach(button => {
      button.classList.remove("on");
    });
    // Wait before the next iteration to make the flash noticeable
    await delay(150);
  }

  alert("Game Over");
  resetGame();
}

// Reset the game to its initial state
function resetGame() {
  state = { ...state, gameActive: false, sequence: [], currentScore: 0, userSequenceIndex: 0 };
  uiElements.gameStateMenu.classList.remove("game-on");
  updateScoreDisplay();
}

// Attach event listeners to buttons for user input
uiElements.allButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    button.classList.add("on");
    setTimeout(() => button.classList.remove("on"), 150); // Adjust time as needed
    checkUserInput(index);
  });
});

// Call init to set up the game
init();

