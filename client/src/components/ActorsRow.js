import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ActorsRow extends React.Component {
	/* actors row */
	render() {
		return (
			<tr className="topFives">
				<td colspan="2" className="topCostars">{this.props.topFives.top_costars}</td>
				<td colspan="2" className="topProfit">{this.props.topFives.most_profitable_movies}</td>
				<td colspan="2" className="topGenre">{this.props.topFives.top_genres}</td>
				<td colspan="2" className="topProd">{this.props.topFives.top_production_companies}</td>
			</tr>
		);
	};
};
