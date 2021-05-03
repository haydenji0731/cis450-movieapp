import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Try.css';

export default class ModalPopUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			overview: "",
		};
	};

	componentDidMount() {
		var url = "http://localhost:8081/overviews/" + this.props.movie_id;
		fetch(url,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(
			data => {
			let overviewResult = data[0].overview
			if (overviewResult != null) {
				this.setState({
						overview: "Overview: " + overviewResult
				})
			}
	 });
	};

	componentDidUpdate() {
		var url = "http://localhost:8081/overviews/" + this.props.movie_id;
		fetch(url,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(
			data => {
			let overviewResult = data[0].overview
			if (overviewResult != null) {
				this.setState({
						overview: "Overview: " + overviewResult
				})
			}
	 });
	};

	render() {
		console.log(this.props.movieId);
		if(this.props.movieId != 0){
			return (
			<div class="modal-content">
  			<div class="modal-body">
						<br></br>
    				<p>{this.state.overview}</p>
  				</div>
				</div>
		  );
		}
		return (
			 null
		);
	};
};
