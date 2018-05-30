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
			numComplete: Array(9).fill(null),
		};
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
			numComplete: Array(9).fill(null),
		});

	}

	handleClick(i) {
		console.log("Clicked " + i);
		const selected = this.state.gridStatus[i] == 'provided' ? null : i;

		//If in erase mode, erase visible info from cell
		if (this.state.penMode == 'eraser' && selected != null) {
			this.erase(selected);
		}
		this.setState({
			selected,
		});

	}

	handleKeyPress(e) {
		let square = this.state.selected;
		const penMode = this.state.penMode;
		if (square != null) {
			if (e.key.includes('Arrow')) {
				if (e.key.includes('Right') && square % 9 != 8) {
					square++;
				}
				else if (e.key.includes('Left') && square % 9 != 0) {
					square--;
				}
				else if (e.key.includes('Up') && square > 8) {
					square -= 9;
				}
				else if (e.key.includes('Down') && square < 72) {
					square += 9;
				}
				this.setState({
					selected: square,
				});
			}
			if (this.state.gridStatus[square] != 'provided') {
				//Enter big numbers (Square)
				if (e.key == 'Backspace') {
					this.erase(square);
				}
				else if (e.key > 0 && e.key < 10) {
					if (penMode == 'pen') {
						this.penEntry(+e.key,square);
					}
					else if (penMode == 'notes') {
						this.noteEntry(+e.key,square);
					}
				}
			}
		}
		console.log(e.key);
	}

	handleNumButton(num) {
		const square = this.state.selected;
		const penMode = this.state.penMode;
		if (square != null) {
			if (this.state.gridStatus[square] != 'provided') {
				if (penMode == 'pen') {
					this.penEntry(num,square);
				}
				//Enter notes (OptionSquare)
				else if (penMode == 'notes') {
					this.noteEntry(num,square);
				}
			}
		}
	}

	handlePenChange = (e) => {
		const penMode = e.currentTarget.id.slice(6);
		this.setState({
			penMode,
		});
	}

	//num: number to enter, i: grid location
	penEntry = (num,i) => {
		let puzzle = this.state.puzzle.slice();
		let gridStatus = this.state.gridStatus.slice();
		let numComplete = this.state.numComplete.slice();
		const prev = puzzle[i];
		puzzle[i] = num;
		gridStatus[i] = puzzle[i] == this.state.solution[i] ? 
			'correct' : 'wrong';
		numComplete[num-1] = this.checkNumComplete(num,puzzle);
		if (prev) {
			numComplete[prev-1] = this.checkNumComplete(prev,puzzle);
		}
		this.setState({
			puzzle,
			gridStatus,
			numComplete,
		});
	}
	//num: number to enter, i: grid location
	noteEntry = (num,i) => {
		let options = this.state.options.slice();
		let selectedOptions = options[i];
		//Already some notes at square
		if (selectedOptions) {
			//Remove the number from the notes
			if (selectedOptions.includes(num)) {
				const index = selectedOptions.indexOf(num);
				selectedOptions = selectedOptions.slice(0,index).concat(selectedOptions.slice(index+1));
			}
			//Add the number to the notes
			else {
				selectedOptions = selectedOptions.concat(num);
			}
		}
		//Not yet notes in square
		else {
			selectedOptions = [num];
		}
		options[i] = selectedOptions;
		this.setState({
			options,
		});
	}

	//Erase grid square at location i
	erase = (i) => {
		let puzzle = this.state.puzzle.slice();
		let gridStatus = this.state.gridStatus.slice();
		const num = puzzle[i];
		//Erase a pen entry if it exists
		if (num != null) {
			puzzle[i] = null;
			gridStatus[i] = null;
			let numComplete = this.state.numComplete.slice();
			numComplete[num-1] = this.checkNumComplete(num,puzzle);
			this.setState({
				puzzle,
				gridStatus,
				numComplete,
			});
		}
		//Erase notes
		else {
			let options = this.state.options.slice();
			options[i] = null;
			this.setState({
				options,
			});
		}
	}

	//Returns null, 'complete' or 'too-many' based on instances of num in puzzle
	checkNumComplete = (num,puzzle) => {
		const count = countInstances(num,puzzle);
		if (count < 9) {
			return null;
		}
		else if (count == 9) {
			return 'complete';
		}
		else { // (count > 9) 
			return 'too-many';
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
		const { selected, solution } = this.state;
		if (selected != null && this.state.gridStatus[selected] != 'provided') {
			let puzzle = this.state.puzzle.slice();
			let gridStatus = this.state.gridStatus.slice();
			let numComplete = this.state.numComplete.slice();
			puzzle[selected] = solution[selected];
			gridStatus[selected] = 'revealed';
			const count = countInstances(puzzle[selected],puzzle);
			if (count == 9) {
				numComplete[puzzle[selected]-1] = 'complete';
			}
			else if (count > 9) {
				numComplete[puzzle[selected]-1] = 'too-many';
			}
			this.setState({
				puzzle,
				gridStatus,
				numComplete,
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
					numComplete={state.numComplete}
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

//Returns the number of instances of val in array
//val must be primitive (found via indexOf/includes)
function countInstances(val,array) {
	let count = 0, last = 0;
	let arr = array.slice();
	while (arr.includes(val)) {
		count++;
		last = arr.indexOf(val);
		arr = arr.slice(last + 1);
	}
	return count;
}