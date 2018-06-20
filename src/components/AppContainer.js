import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import App from './App';

function mapStateToProps(state) {
	return {
		puzzle: state.puzzle,
		solution: state.solution,
		gridStatus: state.gridStatus,
		notes: state.notes,
		selected: state.selected,
		penMode: state.penMode,
		revealErrors: state.revealErrors,
		cheater: state.cheater,
		numComplete: state.numComplete,
		activeGame: state.activeGame,
		gameID: state.gameID,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

//Adds all the data from state and action creators to Main component's PROPS
const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;