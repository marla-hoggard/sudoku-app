import React from 'react';
import { PenMode } from '../actions/actionTypes';
import '../index.css';

const ButtonBar = (props) => {
	const errors = props.revealErrors ? 'Error Checking: ON' : 'Error Checking: OFF';
	const penMode = props.penMode;
	const numButtons = [1,2,3,4,5,6,7,8,9].map((val,index) => {
		const classes = props.numComplete[index] ? "numButton " + props.numComplete[index] : "numButton";
		return (
			<button key={val} className={classes} onClick={() => props.numButton(val)}>
				{val}
			</button>
		);
	})
	return (
		<div className="buttons">
			<div className="button-row">{numButtons}</div>

			<div className="button-row radio-row">
				<div><button onClick={props.newGame}>New Game</button></div>
				<div className="radio-group">
					<input type="radio" id="radio-pen" name="selector-pen" checked={penMode === PenMode.PEN} onChange={props.handlePenChange} />
						<label htmlFor="radio-pen">Pen</label>
					<input type="radio" id="radio-guess" name="selector-pen" checked={penMode === PenMode.GUESS} onChange={props.handlePenChange} />
						<label htmlFor="radio-guess">Guess</label>
					<input type="radio" id="radio-notes" name="selector-pen" checked={penMode === PenMode.NOTES} onChange={props.handlePenChange} />
						<label htmlFor="radio-notes">Notes</label>
					<input type="radio" id="radio-eraser" name="selector-pen" checked={penMode === PenMode.ERASER} onChange={props.handlePenChange} />
						<label htmlFor="radio-eraser">Eraser</label>
				</div>
			</div>
			<div className="button-row">
				<span className="button-category">Guesses: </span>
				<button onClick={props.confirmGuesses}>Make Permanent</button>
				<button onClick={props.removeGuesses}>Clear All</button>
			</div>

			<div className="button-row">
				<button onClick={props.toggleRevealErrors}>{errors}</button>
				<button onClick={props.removeErrors}>Clear Errors</button>
			</div>
			<div className="button-row">
				<button onClick={props.showSquare}>Reveal Square</button>
				<button onClick={props.showSolution}>Show Solution</button>
			</div>
		</div>
	);
}

export default ButtonBar;
