import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
//import { devToolsEnhancer } from 'redux-devtools-extension';
import rootReducer from './reducers/reducers';
import AppContainer from './components/AppContainer';


const enhancers = compose(
	window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(rootReducer, enhancers);

//Enable hot reload when you edit a reducer (components already work)
// if (module.hot) {
// 	module.hot.accept('./reducers/', () => {
// 		const nextRootReducer = require('./reducers/reducers').default;
// 		store.replaceReducer(nextRootReducer);
// 	})
// }

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
		<AppContainer />
	</Provider>,
	document.getElementById('root')
);