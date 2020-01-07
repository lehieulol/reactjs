import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props){
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}
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
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	for (let i = 0; i < 9; i++){
		if(squares[i] == null) return null;
	}
	return 'draw';
}
class Board extends React.Component {
	renderSquare(i) {
		return <Square 
		value={this.props.squares[i]}
		onClick={()=>this.props.onClick(i)}
		/>;
	}
	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			player: Array(2).fill(Array(2)),
			history: [{ 
				squares:Array(9).fill(null),
			}],
			turn: 0,
			player: [['X','X'],['O','O']],
			stepNumber:0,
		}
		
	}
	handleClick(i){
		const history = this.state.history.slice(0,this.state.stepNumber+1);
		const current = history[history.length -1];
		const squares = current.squares.slice();
		if(calculateWinner(squares)!= null||squares[i]!=null) return;
		console.log(this.state.turn);
		squares[i] = this.state.player[this.state.turn][1];
		this.setState({
			history: history.concat([{squares:squares,}]),
			turn: this.state.turn^1,
			stepNumber: this.state.stepNumber+1,
		});
	}
	jumpTo(step){
		this.setState({
			stepNumber:step,
			turn: step%2,
		});
	}
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		let status;
		if(winner != null){
			if(winner == 'draw') status = 'Draw';
			else{
				let name;
				for(let i = 0; i < 2; i++){
					if(this.state.player[i][1] == winner) name = this.state.player[i][0];
				}
				status = 'Champion: ' + name;
			}
		}else{
			status = 'Next player: '+this.state.player[this.state.turn][1];
		}
		const moves = history.map((step,move) => {
			const desc = move ?
				'Go to move#' + move :
				'Go to game start';
			return(
				<li>
					<button onClick = {()=>this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});
		return (
			<div className="game">
				<div className="game-board">
					<Board status = {status} squares = {current.squares} onClick = {(i)=>this.handleClick(i)}/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
