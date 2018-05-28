import React from 'react';
import Square from './Square';
import './index.css'
import {EVEN_GRIDS} from './constants'

export default class Grid extends React.Component {
	renderSquare(i) {
		let classes = EVEN_GRIDS.includes(i) ? "even" : "odd";

		let status = this.props.gridStatus[i];
		if (!this.props.revealErrors && (status == 'correct' || status == 'wrong')) {
			classes += " entered";
		}
		else if (status) {
			classes += ' ' + status;
		}

		// if (this.props.revealErrors) {
		// 	this.props.gridStatus[i] == 'provided' ? classes += " provided" :
		// 	this.props.gridStatus[i] == 'guess' ? classes += " guess" :
		// 	this.props.gridStatus[i] == 'revealed' ? classes += " revealed" :
		// 	this.props.puzzle[i] == this.props.solution[i] ? 
		// 		classes += " correct" : classes += " wrong";
		// }
		// else {
		// 	this.props.gridStatus[i] == 'provided' ? classes += " provided" :
		// 	this.props.gridStatus[i] == 'guess' ? classes += " guess" : 
		// 	this.props.gridStatus[i] == 'revealed' ? classes += " revealed" :
		// 		classes += " entered"
		// }
		
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

	render() {
		let grid = this.props.puzzle.map((value,index) => {
			return this.renderSquare(index);
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