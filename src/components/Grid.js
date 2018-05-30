import React from 'react';
import Square from './Square';
import NotesSquare from './NotesSquare';
import {EVEN_GRIDS} from '../constants';
import { GridStatusOptions } from '../actions/actionTypes';
import '../index.css';


export default class Grid extends React.Component {
	renderSquare(i) {
		let classes = EVEN_GRIDS.includes(i) ? "" : "odd";
		const status = this.props.gridStatus[i];
		if (!this.props.revealErrors && (status == GridStatusOptions.CORRECT || status == GridStatusOptions.WRONG)) {
			classes += " entered";
		}
		else if (status) {
			classes += ' ' + status;
		}
		
		if (this.props.selected == i) {
			classes += " selected"
		}

	    return (
	      <Square 
	        key={i}
	        value={this.props.puzzle[i]} 
	        classes={"gridSquare " + classes}
	        onClick={() => this.props.onClick(i)}
	      />
	    );
	}

	renderNotesSquare(i) {
		let classes = "gridSquare notes";
		if (!EVEN_GRIDS.includes(i)) {
			classes += " odd";
		}
		if (this.props.selected == i) {
			classes += " selected";
		}
		return (
			<NotesSquare 
				key={i}
				classes={classes}
				onClick={() => this.props.onClick(i)}
				notes={this.props.notes[i]}
			/>
		);
	}

	render() {
		if (this.props.gameOver) {
			return (
				<div className="grid game-over">You win!</div>
			);
		}
		else {
			let grid = this.props.puzzle.map((value,index) => {
				if (value || this.props.notes[index] == null) {
					return this.renderSquare(index);
				}
				else {
					return this.renderNotesSquare(index);
				}
			});
			return (
				<div className="grid" 
					onKeyDown={this.props.onKeyDown}
					tabIndex="0">
					{grid}
				</div>
			);
		}
	}
}