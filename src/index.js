import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className={`square ${props.highlighted ? 'highlighted' : ''}`}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        highlighted={this.props.winningLine.indexOf(i)>=0 ? true : false}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let trs=[];
    for (let i=0;i<3;i++) {
      let tds=[]
      for (let j=0;j<3;j++) {
          tds.push(this.renderSquare((i*3)+j));
      }

      trs.push(<div className="board-row">{tds}</div>)
    }

    return <div>{trs}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          squareIndex: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      ascendingHistory: true,
      winningLine: []
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);
    if ( winner.player || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          squareIndex: i,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  sortHistory() {
    this.setState({
      ascendingHistory: !this.state.ascendingHistory
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = 'Go to game start';
      if (move) {
        desc = 'Go to move #' + move;
        if (step.squareIndex !== null) {
          desc = `${desc} (${step.squareIndex%3},${Math.floor(step.squareIndex/3)})`
        }
      }
      return (
        <li key={move}>
          <button
            className={this.state.stepNumber===move ? 'highlightedButton' : ''}
            onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner.player) {
      status = "Winner: " + winner.player;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningLine={winner.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.ascendingHistory ? moves : moves.reverse()}</ol>
          <button onClick={() => this.sortHistory()}>
            Sort by: {this.state.ascendingHistory ?  "Z..A" : "A..Z"}
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: lines[i],
      };
    }
  }
  return {player: null, line: []};
}
