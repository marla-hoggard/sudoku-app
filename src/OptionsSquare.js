import React from 'react';
import './index.css';

export default class OptionsSquare extends React.Component {
	render () {
		let options = Array(9).fill(false);
		this.props.options.forEach(value => {
			options[value - 1] = true;
		});
		const showOptions = options.map((value, index) => {
			return (
				<div className="option" key={index + 1}>
					{value ? index + 1 : ""}
				</div>
			);
		});

		return (
			<div className={this.props.classes} onClick={this.props.onClick}>
				{showOptions}
			</div>
		);
	}
}