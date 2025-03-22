import React, { useState, useEffect } from "react";
import "./App.css";

// Define the size of the grid
const gridSize = 20;

// Initial snake position (array of coordinates)
const initialSnake = [
  [8, 7],
  [8, 8],
  [8, 9],
];

// Generate initial food position randomly within the grid
const initialFood = [
  Math.floor(Math.random() * gridSize),
  Math.floor(Math.random() * gridSize),
];

// Initial direction of the snake
const initialDirection = "DOWN";

function App() {
  const [snake, setSnake] = useState(initialSnake); // State to track the snake's position
  const [food, setFood] = useState(initialFood); // State to track the food's position
  const [direction, setDirection] = useState(initialDirection); // State to track the current direction of the snake
  const [gameOver, setGameOver] = useState(false); // State to track if the game is over
  const [score, setScore] = useState(0); // State to track the player's score
  const [pendingDirection, setPendingDirection] = useState(null); // State to handle direction changes that are pending

  // Interval for snake movement in milliseconds
  const moveInterval = 200;

  // Effect to handle keyboard input for direction changes
  useEffect(() => {
    const handleKeyDown = (e) => {
      let newDirection = direction;

      // Determine the new direction based on the key pressed
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") newDirection = "UP";
          break;
        case "ArrowDown":
          if (direction !== "UP") newDirection = "DOWN";
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") newDirection = "LEFT";
          break;
        case "ArrowRight":
          if (direction !== "LEFT") newDirection = "RIGHT";
          break;
        default:
          return; // Ignore other keys
      }

      // Log the direction change attempt
      console.log(
        `Attempting direction change: ${direction} -> ${newDirection}`
      );

      // Set the pending direction to be applied in the next move
      setPendingDirection(newDirection);
    };

    // Add event listener for keydown events
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Effect to handle the snake's movement and game logic
  useEffect(() => {
    const moveSnake = () => {
      // Stop movement if the game is over
      if (gameOver) {
        console.log("Game over detected. Stopping movement.");
        return;
      }

      // Apply the pending direction if available, otherwise use the current direction
      const appliedDirection = pendingDirection || direction;
      console.log(`Applying direction: ${appliedDirection}`);
      setDirection(appliedDirection);

      // Calculate the new head position based on the direction
      let newHead;
      switch (appliedDirection) {
        case "UP":
          newHead = [snake[0][0] - 1, snake[0][1]];
          break;
        case "DOWN":
          newHead = [snake[0][0] + 1, snake[0][1]];
          break;
        case "LEFT":
          newHead = [snake[0][0], snake[0][1] - 1];
          break;
        case "RIGHT":
          newHead = [snake[0][0], snake[0][1] + 1];
          break;
        default:
          return; // Do nothing if direction is invalid
      }

      // Check if the snake hits the wall
      if (
        newHead[0] >= gridSize ||
        newHead[0] < 0 ||
        newHead[1] >= gridSize ||
        newHead[1] < 0
      ) {
        console.log(
          `Game Over: Snake hit the wall at ${JSON.stringify(newHead)}`
        );
        setGameOver(true);
        return;
      }

      // Check if the snake collides with itself
      if (
        snake.some(
          (segment) => segment[0] === newHead[0] && segment[1] === newHead[1]
        )
      ) {
        console.log(
          `Game Over: Snake hit itself at ${JSON.stringify(newHead)}`
        );
        setGameOver(true);
        return;
      }

      // Create a new snake array with the new head
      const newSnake = [newHead, ...snake];

      // Check if the snake eats the food
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        console.log("Food eaten! Generating new food.");

        // Generate new food position
        setFood([
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize),
        ]);

        // Increment the score
        setScore(score + 1);
      } else {
        // Remove the last segment of the snake if no food is eaten
        newSnake.pop();
      }

      // Update the snake's position
      setSnake(newSnake);

      // Reset the pending direction
      setPendingDirection(null);

      // Log the new snake position
      console.log(`Snake moved to: ${JSON.stringify(newSnake)}`);
    };

    // Set up the game loop to move the snake at regular intervals
    const gameLoop = setInterval(moveSnake, moveInterval);

    // Cleanup the interval on component unmount
    return () => clearInterval(gameLoop);
  }, [snake, direction, pendingDirection, food, gameOver]);

  // Function to restart the game
  const restartGame = () => {
    console.log("Restarting game.");

    // Reset all game states to their initial values
    setSnake(initialSnake);
    setFood([
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    ]);
    setDirection(initialDirection);
    setPendingDirection(null);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="App">
      <h1>Snake Game</h1>
      <div>Score: {score}</div>
      {gameOver ? (
        <>
          {/* Display game over message and restart button */}
          <div>Game Over</div>
          <button onClick={restartGame}>Restart Game</button>
        </>
      ) : (
        <div className="game-board">
          {/* Render the game grid */}
          {Array.from({ length: gridSize }, (_, rowIndex) => (
            <div key={rowIndex} className="row">
              {Array.from({ length: gridSize }, (_, colIndex) => {
                // Check if the current cell is part of the snake
                const isSnake = snake.some(
                  (segment) =>
                    segment[0] === rowIndex && segment[1] === colIndex
                );

                // Check if the current cell contains food
                const isFood = food[0] === rowIndex && food[1] === colIndex;

                // Render the cell with appropriate class
                return (
                  <div
                    key={colIndex}
                    className={`cell ${isSnake ? "snake" : ""} ${
                      isFood ? "food" : ""
                    }`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
