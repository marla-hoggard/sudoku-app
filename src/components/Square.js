import React from 'react';
import '../index.css';

const Square = ({classes, onClick, value}) =>  {
	return (
		<div className={classes} onClick={onClick}>
			{value}
		</div>
	);
}

export default Square;