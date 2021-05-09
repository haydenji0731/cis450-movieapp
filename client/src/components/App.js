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
import CompaniesPart1 from './CompaniesPart1';
import RecGenre from './RecGenre';
import CastRecs from './CastRecs';
import Actors from './Actors';

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
							path="/companiesPart1"
							render={() => <CompaniesPart1 />}
						/>
						<Route
							path="/recGenre"
							render={() => <RecGenre />}
						/>
						<Route
							path="/Cast Recommendations"
							render={() => <CastRecs />}
						/>
						<Route
							path="/actors"
							render={() => <Actors />}
						/>
					</Switch>
				</Router>
			</div>
		);
	};
};
