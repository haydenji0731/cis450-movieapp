import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Recommendations.css';
import '../style/company.css';

export default class CompaniesRow extends React.Component {

render() {
		return (
			<div className="movies-container">
				<div class='paddedRow'>

					<div class='left-column'>
						<img src={"http://image.tmdb.org/t/p/w500" + this.props.poster_path} alt={this.props.title} width="160" height="230"/>
					</div>

					<div class='right-column'>
						<div class='row'>
							<a href={this.props.query}>{this.props.name}</a>
						</div>

						<div class='row'>
							Original Language: {this.props.original_language}
						</div>

						<div class='row'>
							Rating: {this.props.rating}
						</div>

						<div class='row'>
							Production Company: {this.props.companyName}
						</div>
						<br />

				  </div>

				</div>
			</div>
		);
	};
};
