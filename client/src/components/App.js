import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Recommendations from './Recommendations';
import BestMovies from './BestMovies';
import Companies from './Companies';
import Filter from './Filter';
import Actors from './Actors';
import Try from './Try';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Dashboard />}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => <Dashboard />}
						/>
						<Route
							path="/recommendations"
							render={() => <Recommendations />}
						/>
						<Route
							path="/bestmovies"
							render={() => <BestMovies />}
						/>
						<Route
							path="/companies"
							render={() => <Companies />}
						/>
						<Route
							path="/filter"
							render={() => <Filter />}
						/>
						<Route
							path="/actors"
							render={() => <Actors />}
						/>
						<Route
							path="/try"
							render={() => <Try />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};
