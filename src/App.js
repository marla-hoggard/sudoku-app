import React from 'react';
import Sudoku from 'sudoku';
import Grid from './Grid';
import './index.css';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			puzzle: Array(81).fill(null),
			solution: Array(81).fill(null),
			gridStatus: Array(81).fill(null),
			options: Array(81).fill(null),
			selected: null,
			revealErrors: false,
			guessMode: false,
			optionsMode: false,
		};
		//this.provided = Array(81).fill(null);

		this.newGame = this.newGame.bind(this);
		this.toggleRevealErrors = this.toggleRevealErrors.bind(this);
		this.removeErrors = this.removeErrors.bind(this);
		this.showSolution = this.showSolution.bind(this);
	}

	handleClick(i) {
		console.log("Clicked " + i);
		const selected = this.state.gridStatus[i] == 'provided' ? null : i;

		this.setState({
				selected,
		});
	}

	handleKeyPress(e) {
		const square = this.state.selected;
		if (square != null) {
			let puzzle = this.state.puzzle.slice();
			let gridStatus = this.state.gridStatus.slice();
			if (e.key > 0 && e.key < 10) {
				puzzle[square] = e.key;
				gridStatus[square] = puzzle[square] == this.state.solution[square] ?
					'correct' : 'wrong';
			}
			else if (e.key == 'Backspace') {
				puzzle[square] = null;
				gridStatus[square] = null;
			}
			this.setState({
				puzzle,
				gridStatus,
			});
		}
		console.log(e.key);
	}

	newGame() {
		let puzzle = Sudoku.makepuzzle();
		let solution = Sudoku.solvepuzzle(puzzle);

		//Shift puzzle from 0-8 to 1-9
		puzzle = puzzle.map(value => {
			return value != null ? +value + 1 : null
		});

		//Shift solution from 0-8 to 1-9
		solution = solution.map(value => +value + 1);

		let gridStatus = puzzle.map(value => value != null ? 'provided' : null);
		let options = this.state.options.slice();
		options[2] = [1,4,8];
		options[5] = [4,9];

		console.log("puzzle");
		console.log(puzzle);
		console.log("solution");
		console.log(solution);
		console.log("status");
		console.log(gridStatus);

		this.setState({
			puzzle,
			solution,
			gridStatus,
			options,
		});

	}

	toggleRevealErrors() {
		const revealErrors = !this.state.revealErrors;
		this.setState({ revealErrors });
	}

	removeErrors() {
		const puzzle = this.state.puzzle.map((value,index) => {
			return value == this.state.solution[index] ? value : null;
		});
		this.setState({ puzzle });
	}

	showSolution() {
		console.log("Solve it!");
		const gridStatus = this.state.puzzle.map((value,index) => {
			return value == null ? 'revealed' : this.state.gridStatus[index];
		});
		const puzzle = this.state.solution.slice();
		console.log(gridStatus);
		console.log(puzzle);
		this.setState({
			puzzle,
			gridStatus,
			revealErrors: true,
		})
	}

	componentDidMount() {
		this.newGame();
	}

	render() {
		const errors = this.state.revealErrors ? 'Hide Errors' : 'Show Errors';
		return (
			<div>
				<div className="title">Play Sudoku!</div>
				<Grid puzzle={this.state.puzzle} 
					solution={this.state.solution} 
					gridStatus={this.state.gridStatus}
					selected={this.state.selected}
					revealErrors={this.state.revealErrors}
					options={this.state.options}
					onClick={(i) => this.handleClick(i)}
					onKeyDown={(e) => this.handleKeyPress(e)} />
				<div className="buttons">
					<button onClick={this.newGame}>New Game</button>
					<button onClick={this.toggleRevealErrors}>{errors}</button>
					<button onClick={this.removeErrors}>Remove Errors</button>
					<button onClick={this.showSolution}>Show Solution</button>
				</div>
			</div>
		);
	}
}