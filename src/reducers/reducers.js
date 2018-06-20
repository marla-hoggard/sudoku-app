import * as actionTypes from '../actions/actionTypes';
const { PenMode, GridStatusOptions } = actionTypes;

const initialState = {
	puzzle: Array(81).fill(null),
	solution: Array(81).fill(null),
	gridStatus: Array(81).fill(null),
	notes: Array(81).fill(null), 
	selected: null,
	penMode: PenMode.PEN,
	revealErrors: false,
	cheater: false,
	numComplete: Array(9).fill(null),
	activeGame: false,
	gameID: Number(sessionStorage.getItem('gameID')) || 0,
} 

function rootReducer(state = initialState, action) {
	switch(action.type) {
		case actionTypes.NEW_GAME:
			const gridStatus = action.puzzle.map(value => { 
				return value != null ? GridStatusOptions.PROVIDED : null
			});
			updateSessionStorage({
				puzzle: action.puzzle,
				solution: action.solution,
				gridStatus,
				notes: Array(81).fill(null), 
			});

			sessionStorage.setItem('gameID', state.gameID + 1);

			return {
				...initialState,
				puzzle: action.puzzle,
				solution: action.solution,
				gridStatus,
				numComplete: Array(9).fill(null).map((elem,index) => checkNumComplete(index + 1, action.puzzle)),
				revealErrors: state.revealErrors,
				activeGame: true,
				gameID: state.gameID + 1,
			}

		case actionTypes.RESTORE_SESSION:
			return {
				...initialState,
				puzzle: action.session.puzzle,
				solution: action.session.solution,
				gridStatus: action.session.gridStatus,
				notes: action.session.notes,
				numComplete: Array(9).fill(null).map((elem,index) => checkNumComplete(index + 1, action.session.puzzle)),
				activeGame: true,
				gameID: action.gameID,
			}

		case actionTypes.CHANGE_PEN:
			console.log(action.penType);
			return { ...state, penMode: action.penType}

		case actionTypes.PEN_ENTRY:
			return penEntryReducer(state,action);

		case actionTypes.NOTE_ENTRY:
			const newNotes = noteEntryReducer(state.notes, action);
			updateSessionStorage({
				puzzle: state.puzzle,
				solution: state.solution,
				gridStatus: state.gridStatus,
				notes: newNotes,
			});
			return {
				...state,
				notes: newNotes,
			}

		case actionTypes.ERASE:
			return eraseReducer(state,action);

		case actionTypes.CONFIRM_GUESSES:
			return confirmGuessesReducer(state,action);

		case actionTypes.REMOVE_GUESSES:
			return removeGuessesReducer(state,action);

		case actionTypes.TOGGLE_ACTIVE_GAME:
			return { ...state, activeGame: !state.activeGame }

		case actionTypes.TOGGLE_REVEAL_ERRORS:
			return { ...state, revealErrors: !state.revealErrors }

		case actionTypes.REMOVE_ERRORS:
			const noErrors = state.puzzle.map((value,index) => {
				return value === state.solution[index] ? value : null;
			});
			updateSessionStorage({
				puzzle: noErrors,
				solution: state.solution,
				gridStatus: state.gridStatus,
				notes: state.notes,
			});
			return { 
				...state, 
				puzzle: noErrors,
			}

		case actionTypes.SHOW_SQUARE:
			return showSquareReducer(state,action);

		case actionTypes.SHOW_SOLUTION:
			return showSolutionReducer(state,action);

		case actionTypes.CHANGE_SELECTION:
			return {
				...state,
				selected: action.square,
			}

		default:
			return state;
	}
}

//===== SUB-REDUCERS ======

//Enters a number in Pen or Guess mode
function penEntryReducer(state,action) {
	if (action.type !== actionTypes.PEN_ENTRY) {
		return state;
	}
	const { num, square } = action;
	let puzzle = state.puzzle.slice();
	let gridStatus = state.gridStatus.slice();
	let numComplete = state.numComplete.slice();
	const prev = puzzle[square];
	puzzle[square] = num;
	gridStatus[square] = state.penMode === PenMode.GUESS ? 'guess' : 
		puzzle[square] === state.solution[square] ? 'correct' : 'wrong';
	numComplete[num-1] = checkNumComplete(num,puzzle);
	if (prev) {
		numComplete[prev-1] = checkNumComplete(prev,puzzle);
	}
	updateSessionStorage({
		puzzle,
		solution: state.solution,
		gridStatus,
		notes: state.notes,
	});

	return {
		...state,
		puzzle,
		gridStatus,
		numComplete,
	}
}

//Enters a note in Notes mode
//Only needs to be passed notes
function noteEntryReducer(notesFromState,action) {
	if (action.type !== actionTypes.NOTE_ENTRY) {
		return notesFromState;
	}
	const { num, square } = action;
	let notes = notesFromState.slice();
	let visibleNotes = notes[square];

	//Already some notes at square
	if (visibleNotes) {
		//Remove the number from the notes
		if (visibleNotes.includes(num)) {
			const index = visibleNotes.indexOf(num);
			visibleNotes = visibleNotes.slice(0,index).concat(visibleNotes.slice(index+1));
		}
		//Add the number to the notes
		else {
			visibleNotes = visibleNotes.concat(num);
		}
	}
	//Not yet notes in square
	else {
		visibleNotes = [num];
	}
	notes[square] = visibleNotes;
	return notes;
}

//In erase mode -> kicks to subreducer based on what's in current square
function eraseReducer(state,action) {
	if (action.type !== actionTypes.ERASE) {
		return state;
	}
	const num = state.puzzle[action.square];

	//Erase a pen entry if it exists
	if (num != null) {
		return erasePenReducer(state,action);
	}
	//Erase notes
	else {
		return {
			...state,
			notes: eraseNotesReducer(state.notes,action),
		}
	}
}

//Erases the Pen number in the square
function erasePenReducer(state,action) {
	if (action.type !== actionTypes.ERASE) {
		return state;
	}
	const { square } = action;
	let puzzle = state.puzzle.slice();
	let gridStatus = state.gridStatus.slice();
	const num = puzzle[square];

	//Erase a pen entry if it exists
	if (num != null) {
		puzzle[square] = null;
		gridStatus[square] = null;
		let numComplete = state.numComplete.slice();
		numComplete[num-1] = checkNumComplete(num,puzzle);

		updateSessionStorage({
			puzzle,
			solution: state.solution,
			gridStatus,
			notes: state.notes,
		});

		return {
			...state,
			puzzle,
			gridStatus,
			numComplete,
			selected: square,
		}
	}
	//Fallback, should never happen
	else return {
		...state,
		notes: eraseNotesReducer(state.notes,action)
	}
}

//Clears all notes in square
function eraseNotesReducer(notesFromState,action) {
	if (action.type !== actionTypes.ERASE) {
		return notesFromState;
	}
	let notes = notesFromState.slice();
	notes[action.square] = null;

	const storage = JSON.parse(sessionStorage.getItem('sudoku'));
	updateSessionStorage({
		puzzle: storage.puzzle,
		solution: storage.solution,
		gridStatus: storage.gridStatus,
		notes,
	});

	return notes;
}

function confirmGuessesReducer(state,action) {
	const {puzzle,solution} = state;
	let gridStatus = state.gridStatus.map((status,index) => {
		if (status === 'guess') {
			return puzzle[index] === solution[index] ? 'correct' : 'wrong';
		}
		else return status;
	});

	updateSessionStorage({
		puzzle: state.puzzle,
		solution: state.solution,
		gridStatus,
		notes: state.notes
	});

	return {
		...state,
		gridStatus,
	}
}

function removeGuessesReducer(state,action) {
	let puzzle = state.puzzle.slice();
	let numComplete = state.numComplete.slice();
	let gridStatus = [];
	let numToCheck = [];
	state.gridStatus.forEach((status,index) => {
		if (status === 'guess') {
			if (!numToCheck.includes(puzzle[index])) {
				numToCheck.push(puzzle[index]);
			}
			puzzle[index] = null;
			gridStatus.push(null);
		}
		else {
			gridStatus.push(status);
		}
	});
	//Check each number that had been guessed for completeness
	numToCheck.forEach(num => {
		numComplete[num-1] = checkNumComplete(num,puzzle);
	});

	updateSessionStorage({
		puzzle,
		solution: state.solution,
		gridStatus,
		notes: state.notes
	});

	return {
		...state,
		puzzle,
		gridStatus,
		numComplete,
	}
}

//Reveals the answer to the selected square
function showSquareReducer(state,action) {
	if (action.type !== actionTypes.SHOW_SQUARE) {
		return state;
	}
	const { selected, solution } = state;
	if (selected != null && state.gridStatus[selected] !== GridStatusOptions.PROVIDED) {
		let puzzle = state.puzzle.slice();
		let gridStatus = state.gridStatus.slice();
		let numComplete = state.numComplete.slice();
		puzzle[selected] = solution[selected];
		gridStatus[selected] = GridStatusOptions.REVEALED;
		numComplete[puzzle[selected]-1] = checkNumComplete(puzzle[selected],puzzle);

		updateSessionStorage({
			puzzle,
			solution: state.solution,
			gridStatus,
			notes: state.notes
		});

		return {
			...state,
			puzzle,
			gridStatus,
			numComplete,
		};
	}
}

//Reveals entire solution
function showSolutionReducer(state,action) {
	if (action.type !== actionTypes.SHOW_SOLUTION) {
		return state;
	}
	const gridStatus = state.puzzle.map((value,index) => {
		return value == null ? GridStatusOptions.REVEALED : state.gridStatus[index];
	});
	const puzzle = state.solution.slice();

	updateSessionStorage({
			puzzle,
			solution: state.solution,
			gridStatus,
			notes: state.notes
		});

	return {
		...state,
		puzzle,
		gridStatus,
		revealErrors: true,
		cheater: true,
		activeGame: false,
	};
}

//============ UTILITY FUNCTIONS =============

//Returns the number of instances of val in array
//val must be primitive (found via indexOf/includes)
function countInstances(val,array) {
	let count = 0, last = 0;
	let arr = array.slice();
	while (arr.includes(val)) {
		count++;
		last = arr.indexOf(val);
		arr = arr.slice(last + 1);
	}
	return count;
}

//Returns null, 'complete' or 'too-many' based on instances of num in puzzle
function checkNumComplete(num,puzzle) {
	const count = countInstances(num,puzzle);
	if (count < 9) {
		return null;
	}
	else if (count === 9) {
		return 'complete';
	}
	else { // (count > 9) 
		return 'too-many';
	}
}

//Updates session storage (key sudoku) with the passed in object
function updateSessionStorage(storage) {
	sessionStorage.setItem('sudoku',JSON.stringify(storage));
}


// function restoreSession() => {
// 	if (sessionStorage.getItem('sudoku')) {
// 		const storage = JSON.parse(sessionStorage.getItem('sudoku'));
// 		console.log(storage);
// 		let numComplete = [];
// 		for (var i = 1; i <= 9; i++) {
// 			numComplete.push(checkNumComplete(i,storage.puzzle))
// 		}
// 		this.setState({
// 			puzzle: storage.puzzle,
// 			solution: storage.solution,
// 			gridStatus: storage.gridStatus,
// 			options: storage.options,
// 			selected: null,
// 			penMode: 'pen', 
// 			cheater: false,
// 			numComplete,
// 			activeGame: true,
// 		});
// 		return true;
// 	}
// 	else {
// 		console.log("Nothing in sessionStorage");
// 		return false;
// 	}
// }



export default rootReducer;