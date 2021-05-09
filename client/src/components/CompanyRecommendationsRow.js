import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Recommendations.css';

console.log(Logo);

export default class CompanyRecommendationsRow extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			childToWatchList: [],
			genres: [],
			genresDisplay: [],
		};

		this.callbackFunction = this.callbackFunction.bind(this);
		this.getGenres = this.getGenres.bind(this);
		this.showGenres = this.showGenres.bind(this);
	};

	componentDidMount() {
		console.log(this.props.title);
		console.log(this.props.id);
		this.getGenres(this.props.id);
	};

	componentDidUpdate(prevProps) {
	  if (this.props.id !== prevProps.id) {
	    this.getGenres(this.props.id);
	  }
	}

	callbackFunction(movie) {
		this.props.parentCallback(movie);
	};

	getGenres(movie_id) {
		var url = "http://localhost:8081/genres/"+movie_id;
		fetch(url,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(data => {
		// Here you need to use an temporary array to store NeededInfo only
		let genresResult = []
		for (var i = 0; i < data.length; i++) {
			genresResult.push(data[i].genre);
		}
		this.setState({
				genres: genresResult
		})
		this.showGenres();
	});
	};

	showGenres() {
		const genresDisplayArr = [];
		for (var i = 0; i < this.state.genres.length; i++) {
			if (i == this.state.genres.length - 1) {
				genresDisplayArr.push(this.state.genres[i])
			}
			else {
				genresDisplayArr.push(this.state.genres[i].trim() + ", ")
			}
		};
		this.setState({
			genresDisplay: genresDisplayArr
		});
	};

	render() {
		return (
				<div class="flip-display">
					<div class="flip-display-inner">
						<div class="flip-display-front">
							<img src={"https://m.media-amazon.com/images/M"+this.props.path} alt={this.props.title} width="240" height="345"/>
						</div>

						<div class="flip-display-back">
							<div class="centered"><p className="boldText" style={{textAlign: 'center', fontSize: 23}}>{this.props.title}</p>
								<p>Company: {this.props.companyName}</p>
								<p>Genres: {this.state.genresDisplay}</p>
								<p>Rating: {this.props.rating}</p></div>
						</div>
					</div>
				</div>
		);
	};
};
