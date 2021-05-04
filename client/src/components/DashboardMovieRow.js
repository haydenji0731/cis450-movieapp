import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../style/DashboardMovieRow.css';

export default class DashboardMovieRow extends React.Component {

	render() {
		return (
			<div class='profile-container'>
				{this.props.movie}
				<br></br>
				<img src={"https://www.themoviedb.org/t/p/w200"+this.props.overview} 
			 			  alt = {this.props.title} width="160" height="230" />
			</div>
		);
	};
};
