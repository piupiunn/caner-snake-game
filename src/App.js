import React, { useState, useEffect } from "react";
import "./App.css";

const gridSize = 20;
const initialSnake = [
  [8, 7],
  [8, 8],
  [8, 9],
];
const initialFood = [
  Math.floor(Math.random() * gridSize),
  Math.floor(Math.random() * gridSize),
];
const initialDirection = "DOWN";

function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState(initialDirection);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [pendingDirection, setPendingDirection] = useState(null);
  const moveInterval = 200; // Movement interval in ms

  useEffect(() => {
    const handleKeyDown = (e) => {
      let newDirection = direction;
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
          return;
      }

      console.log(
        `Attempting direction change: ${direction} -> ${newDirection}`
      );
      setPendingDirection(newDirection); // Set pending direction
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
      if (gameOver) {
        console.log("Game over detected. Stopping movement.");
        return;
      }

      const appliedDirection = pendingDirection || direction;
      console.log(`Applying direction: ${appliedDirection}`);
      setDirection(appliedDirection);

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
          return;
      }

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

      const newSnake = [newHead, ...snake];
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        console.log("Food eaten! Generating new food.");
        setFood([
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize),
        ]);
        setScore(score + 1);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
      setPendingDirection(null); // Reset pending direction
      console.log(`Snake moved to: ${JSON.stringify(newSnake)}`);
    };

    const gameLoop = setInterval(moveSnake, moveInterval);
    return () => clearInterval(gameLoop);
  }, [snake, direction, pendingDirection, food, gameOver]);

  const restartGame = () => {
    console.log("Restarting game.");
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
          <div>Game Over</div>
          <button onClick={restartGame}>Restart Game</button>
        </>
      ) : (
        <div className="game-board">
          {Array.from({ length: gridSize }, (_, rowIndex) => (
            <div key={rowIndex} className="row">
              {Array.from({ length: gridSize }, (_, colIndex) => {
                const isSnake = snake.some(
                  (segment) =>
                    segment[0] === rowIndex && segment[1] === colIndex
                );
                const isFood = food[0] === rowIndex && food[1] === colIndex;
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
