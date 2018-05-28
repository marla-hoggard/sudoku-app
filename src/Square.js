import React from 'react';
import './index.css';

export default class Square extends React.Component {
	render () {
		return (
			<div className={this.props.classes} 
				onClick={this.props.onClick}>
				{this.props.value}
			</div>
		);
	}
}