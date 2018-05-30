import React from 'react';
import Square from './Square';
import OptionsSquare from './OptionsSquare';
import {EVEN_GRIDS} from '../constants';
import '../index.css';


export default class Grid extends React.Component {
	renderSquare(i) {
		let classes = EVEN_GRIDS.includes(i) ? "" : "odd";
		const status = this.props.gridStatus[i];
		if (!this.props.revealErrors && (status == 'correct' || status == 'wrong')) {
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

	renderOptionsSquare(i) {
		let classes = "gridSquare options";
		if (!EVEN_GRIDS.includes(i)) {
			classes += " odd";
		}
		if (this.props.selected == i) {
			classes += " selected";
		}
		return (
			<OptionsSquare 
				key={i}
				classes={classes}
				onClick={() => this.props.onClick(i)}
				options={this.props.options[i]}
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
				if (value || this.props.options[index] == null) {
					return this.renderSquare(index);
				}
				else {
					return this.renderOptionsSquare(index);
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