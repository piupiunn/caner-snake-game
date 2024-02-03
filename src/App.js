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

  useEffect(() => {
    const handleKeyDown = (e) => {
      let newDirection = direction;
      switch (e.key) {
        case "ArrowUp":
          newDirection = direction !== "DOWN" ? "UP" : "DOWN";
          break;
        case "ArrowDown":
          newDirection = direction !== "UP" ? "DOWN" : "UP";
          break;
        case "ArrowLeft":
          newDirection = direction !== "RIGHT" ? "LEFT" : "RIGHT";
          break;
        case "ArrowRight":
          newDirection = direction !== "LEFT" ? "RIGHT" : "LEFT";
          break;
        default:
          return;
      }
      setDirection(newDirection);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
      if (gameOver) return;

      let newHead;
      switch (direction) {
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
        newHead[1] < 0 ||
        snake.some(
          (segment) => segment[0] === newHead[0] && segment[1] === newHead[1]
        )
      ) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snake];
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setFood([
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize),
        ]);
        setScore(score + 1);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameLoop = setInterval(moveSnake, 200);
    return () => clearInterval(gameLoop);
  }, [snake, direction, food, gameOver]);

  const restartGame = () => {
    setSnake(initialSnake);
    setFood([
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    ]);
    setDirection(initialDirection);
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
