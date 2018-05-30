import Sudoku from 'sudoku';
/* action types */
export const NEW_GAME = 'NEW_GAME';
export const CHANGE_PEN = 'CHANGE_PEN';
export const PEN_ENTRY = 'PEN_ENTRY';
export const NOTE_ENTRY = 'NOTE_ENTRY';
export const ERASE = 'ERASE';
export const TOGGLE_REVEAL_ERRORS = 'TOGGLE_REVEAL_ERRORS';
export const REMOVE_ERRORS = 'REMOVE_ERRORS';
export const SHOW_SQUARE = 'SHOW_SQUARE';
export const SHOW_SOLUTION = 'SHOW_SOLUTION';
export const CHANGE_SELECTION = 'CHANGE_SELECTION';

/* state constants */
export const PenMode = {
	PEN: 'PEN',
	NOTES: 'NOTES',
	ERASER: 'ERASER'
}

export const GridStatusOptions = {
	PROVIDED: 'provided',
	REVEALED: 'revealed',
	CORRECT: 'correct',
	WRONG: 'wrong'
}

/* action creators */
export function newGame() {
	let puzzle = Sudoku.makepuzzle();
	let solution = Sudoku.solvepuzzle(puzzle);

	//Shift puzzle from 0-8 to 1-9
	puzzle = puzzle.map(value => {
		return value != null ? +value + 1 : null
	});

	//Shift solution from 0-8 to 1-9
	solution = solution.map(value => +value + 1);

	return {
		type: NEW_GAME,
		puzzle,
		solution,
	}
}

export function changePen(penType) {
	return {
		type: CHANGE_PEN,
		penType,
	}
}

export function penEntry(num,square) {
	return {
		type: PEN_ENTRY,
		num,
		square,
	}
}

export function noteEntry(num,square) {
	return {
		type: NOTE_ENTRY,
		num,
		square,
	}
}

export function erase(square) {
	return {
		type: ERASE,
		square,
	}
}

export function toggleRevealErrors() {
	return {
		type: TOGGLE_REVEAL_ERRORS
	}
}

export function removeErrors() {
	return {
		type: REMOVE_ERRORS
	}
}

export function showSquare() {
	return {
		type: SHOW_SQUARE
	}
}

export function showSolution() {
	return {
		type: SHOW_SOLUTION
	}
}

export function changeSelection(square) {
	return {
		type: 'CHANGE_SELECTION',
		square,
	}
}



