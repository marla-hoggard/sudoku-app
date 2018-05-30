import { NEW_GAME,
		CHANGE_PEN,
		PEN_ENTRY,
		NOTE_ENTRY,
		ERASE,
		TOGGLE_REVEAL_ERRORS,
		REMOVE_ERRORS,
		SHOW_SQUARE,
		SHOW_SOLUTION,
		CHANGE_SELECTION,

		PenMode, 
		GridStatusOptions,
	} from './actions';

const initialState = {
	puzzle: Array(81).fill(null),
	solution: Array(81).fill(null),
	gridStatus: Array(81).fill(null),
	notes: Array(81).fill(null), //was options
	selected: null,
	penMode: PenMode.PEN,
	revealErrors: false,
	cheater: false,
	numComplete: Array(9).fill(null),
}

function rootReducer(state = initialState, action) {
	switch(action.type) {
		case NEW_GAME:
			//const { puzzle, solution } = action;
			const gridStatus = action.puzzle.map(value => { 
				return value != null ? GridStatusOptions.PROVIDED : null
			});
			return {
				...initialState,
				puzzle: action.puzzle,
				solution: action.solution,
				gridStatus,
				revealErrors: state.revealErrors
			}
		case CHANGE_PEN:
			return { ...state, penMode: action.penType}
		case PEN_ENTRY:
			return penEntryReducer(state,action);
		case NOTE_ENTRY:
			return {
				...state,
				notes: noteEntryReducer(state.notes, action)
			}
		case ERASE:
			return eraseReducer(state,action);
		case TOGGLE_REVEAL_ERRORS:
			return { ...state, revealErrors: !state.revealErrors }
		case REMOVE_ERRORS:
			const noErrors = state.puzzle.map((value,index) => {
				return value == this.state.solution[index] ? value : null;
			});
			return { 
				...state, 
				puzzle: noErrors,
			}
		case SHOW_SQUARE:
			return showSquareReducer(state,action);
		case SHOW_SOLUTION:
			return showSolutionReducer(state,action);
		case CHANGE_SELECTION:
			return {
				...state,
				selected: action.square,
			}
		default:
			return state;
	}
}

//===== SUB-REDUCERS

function penEntryReducer(state,action) {
	if (action.type !== 'PEN_ENTRY') {
		return state;
	}
	const { num, square } = action;
	let puzzle = state.puzzle.slice();
	let gridStatus = state.gridStatus.slice();
	let numComplete = state.numComplete.slice();
	const prev = puzzle[square];
	puzzle[square] = num;
	gridStatus[square] = puzzle[square] == this.state.solution[square] ? 
		'correct' : 'wrong';
	numComplete[num-1] = checkNumComplete(num,puzzle);
	if (prev) {
		numComplete[prev-1] = checkNumComplete(prev,puzzle);
	}
	return {
		...state,
		puzzle,
		gridStatus,
		numComplete,
	}
}

//Only needs notes
function noteEntryReducer(notesFromState,action) {
	if (action.type !== 'NOTE_ENTRY') {
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

function eraseReducer(state,action) {
	if (action.type !== 'ERASE') {
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

function erasePenReducer(state,action) {
	if (action.type !== 'ERASE') {
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

function eraseNotesReducer(notesFromState,action) {
	if (action.type !== 'ERASE') {
		return notesFromState;
	}
	let notes = notesFromState.slice();
	notes[action.square] = null;
	return notes;
}

function showSquareReducer(state,action) {
	const { selected, solution } = state;
	if (selected != null && state.gridStatus[selected] != GridStatusOptions.PROVIDED) {
		let puzzle = state.puzzle.slice();
		let gridStatus = state.gridStatus.slice();
		let numComplete = state.numComplete.slice();
		puzzle[selected] = solution[selected];
		gridStatus[selected] = GridStatusOptions.REVEALED;
		numComplete[puzzle[selected]-1] = checkNumComplete(puzzle[selected],puzzle);
		return {
			...state,
			puzzle,
			gridStatus,
			numComplete,
		};
	}
}

function showSolutionReducer(state,action) {
	const gridStatus = state.puzzle.map((value,index) => {
		return value == null ? GridStatusOptions.REVEALED : state.gridStatus[index];
	});
	const puzzle = state.solution.slice();
	return {
		...state,
		puzzle,
		gridStatus,
		revealErrors: true,
		cheater: true,
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
	else if (count == 9) {
		return 'complete';
	}
	else { // (count > 9) 
		return 'too-many';
	}
}

export default rootReducer;