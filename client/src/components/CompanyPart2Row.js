import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CompanyRow extends React.Component {
	/* actors row */
	render() {
		return (
			<tr className="topFives" style={{textAlign: 'center', height: 40}}>
				<td colspan="2" className="topProf">{this.props.topFives.Top5ProfitableMovies}</td>
				<td colspan="2" className="topRate">{this.props.topFives.Top5RatedMovies}</td>
				<td colspan="2" className="topWeightRate">{this.props.topFives.Top5WeightedRatedMovies}</td>
				<td colspan="2" className="topGenre">{this.props.topFives.Top5Genres}</td>
				<td colspan="2" className="topKeyword">{this.props.topFives.Top5Keywords}</td>
			</tr>
		);
	};
};
