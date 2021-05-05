import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Recommendations.css';

export default class CompaniesListRows extends React.Component {

render() {
		return (
			<div className="movies-container">
				<div class='paddedRow'>

					<div class='right-column'>
						<div class='row'>
							<a href={this.props.query}>{this.props.name}</a>
						</div>

						<div class='row'>
							Total Revenue: {this.props.total_revenue}
						</div>
		
				  </div>

				</div>
			</div>
		);
	};
};
