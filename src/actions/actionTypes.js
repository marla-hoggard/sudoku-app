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
	PEN: 'pen',
	NOTES: 'notes',
	ERASER: 'eraser'
}

export const GridStatusOptions = {
	PROVIDED: 'provided',
	REVEALED: 'revealed',
	CORRECT: 'correct',
	WRONG: 'wrong'
}
