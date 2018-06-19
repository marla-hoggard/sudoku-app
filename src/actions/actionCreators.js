import Sudoku from 'sudoku';
import * as types from './actionTypes'

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
		type: types.NEW_GAME,
		puzzle,
		solution,
	}
}

export function changePen(penType) {
	return {
		type: types.CHANGE_PEN,
		penType,
	}
}

export function penEntry(num,square) {
	return {
		type: types.PEN_ENTRY,
		num,
		square,
	}
}

export function noteEntry(num,square) {
	return {
		type: types.NOTE_ENTRY,
		num,
		square,
	}
}

export function erase(square) {
	return {
		type: types.ERASE,
		square,
	}
}

export function confirmGuesses() {
	return {
		type: types.CONFIRM_GUESSES
	}
}

export function removeGuesses() {
	return {
		type: types.REMOVE_GUESSES
	}
}

export function toggleRevealErrors() {
	return {
		type: types.TOGGLE_REVEAL_ERRORS
	}
}

export function removeErrors() {
	return {
		type: types.REMOVE_ERRORS
	}
}

export function showSquare() {
	return {
		type: types.SHOW_SQUARE
	}
}

export function showSolution() {
	return {
		type: types.SHOW_SOLUTION
	}
}

export function changeSelection(square) {
	return {
		type: types.CHANGE_SELECTION,
		square,
	}
}



