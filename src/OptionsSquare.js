import React from 'react';
import './index.css';

const OptionsSquare = ({options, classes, onClick}) => {
	let optionMap = Array(9).fill(false);
	options.forEach(value => {
		optionMap[value - 1] = true;
	});
	optionMap = optionMap.map((value, index) => {
		return (
			<div className="option" key={index + 1}>
				{value ? index + 1 : "" }
			</div>
		);
	});

	return (
		<div className={classes} onClick={onClick}>
			{optionMap}
		</div>
	);
}

export default OptionsSquare;