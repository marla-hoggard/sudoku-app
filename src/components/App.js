import { PenMode, GridStatusOptions } from '../actions/actionTypes';
import React from 'react';

import Timer from './Timer';
import Grid from './Grid';
import ButtonBar from './ButtonBar';
import '../index.css';

export default class App extends React.Component {
	//penMode == 'eraser': erase(i), else: changeSelection(i)
	handleClick(i) {
		console.log("Clicked " + i);
		const selected = this.props.gridStatus[i] === GridStatusOptions.PROVIDED ? null : i;

		//If in erase mode, erase visible info from cell
		if (this.props.penMode === PenMode.ERASER && selected != null) {
			this.props.erase(selected);
		}
		this.props.changeSelection(selected);

	}

	//Arrow keys will dispatch changeSelection
	//Backspace will dispatch erase
	//Numbers will dispatch penEntry or noteEntry
	handleKeyPress(e) {
		let square = this.props.selected;
		const penMode = this.props.penMode;
		if (square != null) {
			if (e.key.includes('Arrow')) {
				if (e.key.includes('Right') && square % 9 !== 8) {
					this.props.changeSelection(square + 1);
				}
				else if (e.key.includes('Left') && square % 9 !== 0) {
					this.props.changeSelection(square - 1);
				}
				else if (e.key.includes('Up') && square > 8) {
					this.props.changeSelection(square - 9);
				}
				else if (e.key.includes('Down') && square < 72) {
					this.props.changeSelection(square + 9);
				}
			}
			if (this.props.gridStatus[square] !== GridStatusOptions.PROVIDED) {
				if (e.key === 'Backspace') {
					this.props.erase(square);
				}
				else if (e.key > 0 && e.key < 10) {
					if (penMode === PenMode.PEN || penMode === PenMode.GUESS) {
						this.props.penEntry(+e.key,square);
					}
					else if (penMode === PenMode.NOTES) {
						this.props.noteEntry(+e.key,square);
					}
				}
			}
		}
		if (e.key.toLowerCase() === 'p') {
			this.props.changePen(PenMode.PEN)
		}
		else if (e.key.toLowerCase() === 'g') {
			this.props.changePen(PenMode.GUESS)
		}
		else if (e.key.toLowerCase() === 'n') {
			this.props.changePen(PenMode.NOTES)
		}
		else if (e.key.toLowerCase() === 'e') {
			this.props.changePen(PenMode.ERASER)
		}
		console.log(e.key);
	}

	//Dispatch penEntry or noteEntry accordingly
	handleNumButton(num) {
		const square = this.props.selected;
		const penMode = this.props.penMode;
		if (square != null) {
			if (this.props.gridStatus[square] !== GridStatusOptions.PROVIDED) {
				if (penMode === PenMode.PEN || penMode === PenMode.GUESS) {
					this.props.penEntry(num,square);
				}
				else if (penMode === PenMode.NOTES) {
					this.props.noteEntry(num,square);
				}
			}
		}
	}

	handlePenChange = (e) => {
		const penMode = e.currentTarget.id.slice(6);
		this.props.changePen(penMode);
	}

	componentDidMount() {
		this.props.newGame();
	}

	componentDidUpdate() {
		//Make sure handleKeyPress continues to work after button press
		if (this.props.selected != null) {
			document.querySelectorAll('.grid')[0].focus();
		}
	}

	render() {
		const props = this.props;
		const gameOver = props.puzzle.includes(null) || 
				props.gridStatus.includes('wrong') || 
				props.cheater ? false : true;
		return (
			<div>
				<div className="title">Play Sudoku!</div>
				<Timer {...this.props} />
				<Grid 
					{...this.props}
					paused={!props.activeGame && !props.cheater}
					gameOver={gameOver} 
					onClick={(i) => this.handleClick(i)}
					onKeyDown={(e) => this.handleKeyPress(e)} />
				<ButtonBar 
					{...this.props}
					numButton={(i) => this.handleNumButton(i)}
					handlePenChange={(e) => this.handlePenChange(e)}
				/>
			</div>
		);
	}

}
