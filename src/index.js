import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './redux/reducers';
import App from './components/App';

const store = createStore(rootReducer);

console.log(store.getState());

/* Test actions/reducers below: */
// const unsubscribe = store.subscribe(() =>
//   console.log(store.getState())
// )

// store.dispatch(changePen(PenMode.notes));
// store.dispatch(toggleRevealErrors());
// store.dispatch(changePen(PenMode.eraser));
// store.dispatch(toggleRevealErrors());

// unsubscribe();


// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);