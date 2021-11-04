// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const initialHistory = [Array(9).fill(null)]
function Board({history, setHistory, currentStep, setCurrentStep}) {
  const currentSquares = history[currentStep]
  const nextValue = calculateNextValue(currentSquares) // ('X' or 'O')
  const winner = calculateWinner(currentSquares) // ('X', 'O', or null)

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (winner || currentSquares[square]) return

    const nextEntry = [...currentSquares]
    nextEntry[square] = nextValue
    const nextStep = currentStep + 1

    setHistory([...history.slice(0, nextStep), nextEntry])
    setCurrentStep(nextStep)
  }

  function restart() {
    setHistory(initialHistory)
    setCurrentStep(0)
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {currentSquares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function HistoryEntry({step, currentStep, setCurrentStep}) {
  const isCurrent = step === currentStep
  let text
  if (step === 0) {
    text = `Go to game start${isCurrent ? ' (current)' : ''}`
  } else {
    text = `Go to move #${step}${isCurrent ? ' (current)' : ''}`
  }

  return (
    <button disabled={isCurrent} onClick={() => setCurrentStep(step)}>
      {text}
    </button>
  )
}

function GameInfo({history, currentStep, setCurrentStep}) {
  const squares = history[currentStep]
  const nextValue = calculateNextValue(squares) // ('X' or 'O')
  const winner = calculateWinner(squares) // ('X', 'O', or null)

  return (
    <>
      <div className="status">
        {calculateStatus(winner, squares, nextValue)}
      </div>
      <ol>
        {history.map((_, index) => (
          <li key={index}>
            <HistoryEntry
              step={index}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </li>
        ))}
      </ol>
    </>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState(
    'tic-tac-toe:history',
    initialHistory, // Remove once interoperability is added
  )
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:step',
    history.length - 1,
  )

  return (
    <div className="game">
      <div className="game-board">
        <Board
          history={history}
          setHistory={setHistory}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
      <div className="game-info">
        <GameInfo
          history={history}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
