import React from 'react';
import Sudoku from 'sudoku';
import Grid from './Grid';
import ButtonBar from './ButtonBar';
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
			penMode: 'pen',
			revealErrors: false,
			optionsMode: false,
			cheater: false,
		};
	}

	handleClick(i) {
		console.log("Clicked " + i);
		const selected = this.state.gridStatus[i] == 'provided' ? null : i;

		//If in erase mode, erase visible info from cell
		if (this.state.penMode == 'eraser' && selected != null) {
			if (this.state.puzzle[selected]) {
				let puzzle = this.state.puzzle.slice();
				let gridStatus = this.state.gridStatus.slice();
				puzzle[selected] = null;
				gridStatus[selected] = null;
				this.setState({
					selected,
					puzzle,
					gridStatus,
				});
			}
			else if (this.state.options[selected]) {
				let options = this.state.options.slice();
				options[selected] = null;
				this.setState({
					selected,
					options,
				});
			}
		}
		else {
			this.setState({
				selected,
			});
		}

	}

	handleKeyPress(e) {
		let square = this.state.selected;
		const penMode = this.state.penMode;
		if (square != null) {
			if (e.key.startsWith('Arrow')) {
				if (e.key == 'ArrowRight' && square % 9 != 8) {
					square++;
				}
				else if (e.key == 'ArrowLeft' && square % 9 != 0) {
					square--;
				}
				else if (e.key == 'ArrowUp' && square > 8) {
					square -= 9;
				}
				else if (e.key == 'ArrowDown' && square < 72) {
					square += 9;
				}
				this.setState({
					selected: square,
				});
			}
			if (this.state.gridStatus[square] != 'provided') {
				//Enter big numbers (Square)
				if (penMode == 'pen') {
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
				//Enter notes (OptionSquare)
				else if (penMode == 'notes') {
					let options = this.state.options.slice();
					let selectedOptions = options[square];
					if (e.key > 0 && e.key < 10) {
						//Already some notes at square
						if (selectedOptions) {
							//Remove the number from the notes
							if (selectedOptions.includes(e.key)) {
								const index = selectedOptions.indexOf(e.key);
								selectedOptions = selectedOptions.slice(0,index).concat(selectedOptions.slice(index+1));
							}
							//Add the number to the notes
							else {
								selectedOptions = selectedOptions.concat(e.key);
							}
						}
						//Not yet notes in square
						else {
							selectedOptions = [e.key];
						}
					}
					else if (e.key == 'Backspace') {
						selectedOptions = null;
					}
					options[square] = selectedOptions;
					this.setState({
						options,
					});
				}
			}
		}
		console.log(e.key);
	}


	newGame = () => {
		let puzzle = Sudoku.makepuzzle();
		let solution = Sudoku.solvepuzzle(puzzle);

		//Shift puzzle from 0-8 to 1-9
		puzzle = puzzle.map(value => {
			return value != null ? +value + 1 : null
		});

		//Shift solution from 0-8 to 1-9
		solution = solution.map(value => +value + 1);

		let gridStatus = puzzle.map(value => value != null ? 'provided' : null);

		this.setState({
			puzzle,
			solution,
			gridStatus,
			options: Array(81).fill(null),
			selected: null,
			penMode: 'pen', //pen vs notes
			optionsMode: false,
			cheater: false,
		});

	}

	handlePenChange = (e) => {
		const penMode = e.currentTarget.id.slice(6);
		console.log(penMode)
		this.setState({
			penMode,
		});
	}

	handleNumButton(i) {
		const square = this.state.selected;
		const penMode = this.state.penMode;
		if (square != null) {
			if (this.state.gridStatus[square] != 'provided') {
				//Enter big numbers (Square)
				if (penMode == 'pen') {
					let puzzle = this.state.puzzle.slice();
					let gridStatus = this.state.gridStatus.slice();
					puzzle[square] = i;
					gridStatus[square] = puzzle[square] == this.state.solution[square] ?
						'correct' : 'wrong';
					this.setState({
						puzzle,
						gridStatus,
					});
				}
				//Enter notes (OptionSquare)
				else if (penMode == 'notes') {
					let options = this.state.options.slice();
					let selectedOptions = options[square];
					//Already some notes at square
					if (selectedOptions) {
						//Remove the number from the notes
						if (selectedOptions.includes(i)) {
							const index = selectedOptions.indexOf(i);
							selectedOptions = selectedOptions.slice(0,index).concat(selectedOptions.slice(index+1));
						}
						//Add the number to the notes
						else {
							selectedOptions = selectedOptions.concat(i);
						}
					}
					//Not yet notes in square
					else {
						selectedOptions = [i];
					}
					options[square] = selectedOptions;
					this.setState({
						options,
					});
				}
			}
		}
	}

	toggleRevealErrors = () => {
		const revealErrors = !this.state.revealErrors;
		this.setState({ revealErrors });
	}

	removeErrors = () => {
		const puzzle = this.state.puzzle.map((value,index) => {
			return value == this.state.solution[index] ? value : null;
		});
		this.setState({ puzzle });
	}

	showSquare = () => {
		const { selected, gridStatus, puzzle, solution } = this.state;
		if (selected != null && gridStatus[selected] != 'provided') {
			let newPuzzle = puzzle.slice();
			newPuzzle[selected] = solution[selected];
			let newStatus = gridStatus.slice();
			newStatus[selected] = 'revealed';
			this.setState({
				puzzle: newPuzzle,
				gridStatus: newStatus,
			});
		}
	}

	showSolution = () => {
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
			cheater: true,
		})
	}

	componentDidMount() {
		this.newGame();
	}

	componentDidUpdate() {
		//Make sure handleKeyPress continues to work after button press
		if (this.state.selected != null) {
			document.querySelectorAll('.grid')[0].focus();
		}
	}

	render() {
		const state = this.state;
		const gameOver = state.puzzle.includes(null) || 
				state.gridStatus.includes('wrong') || 
				state.cheater ? false : true;
		return (
			<div>
				<div className="title">Play Sudoku!</div>
				<Grid puzzle={state.puzzle} 
					solution={state.solution}
					gameOver={gameOver} 
					gridStatus={state.gridStatus}
					selected={state.selected}
					revealErrors={state.revealErrors}
					penMode={state.penMode}
					options={state.options}
					onClick={(i) => this.handleClick(i)}
					onKeyDown={(e) => this.handleKeyPress(e)} />
				<ButtonBar 
					revealErrors={state.revealErrors}
					penMode={state.penMode}
					numButton={(i) => this.handleNumButton(i)}
					newGame={this.newGame}
					handlePenChange={this.handlePenChange}
					toggleRevealErrors={this.toggleRevealErrors}
					removeErrors={this.removeErrors}
					showSquare={this.showSquare}
					showSolution={this.showSolution}
				/>
			</div>
		);
	}
}