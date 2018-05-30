import React from 'react';
import '../index.css';

const NotesSquare = ({notes, classes, onClick}) => {
	let noteMap = Array(9).fill(false);
	notes.forEach(value => {
		noteMap[value - 1] = true;
	});
	noteMap = noteMap.map((value, index) => {
		return (
			<div className="note" key={index + 1}>
				{value ? index + 1 : "" }
			</div>
		);
	});

	return (
		<div className={classes} onClick={onClick}>
			{noteMap}
		</div>
	);
}

export default NotesSquare;