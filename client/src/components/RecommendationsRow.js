import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Recommendations.css';

console.log(Logo);

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name, and the list of recommended movies.
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
			if (i == (this.state.genres.length - 1)) {
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
			<div className="movies-container">

			<div class='row'>
				{this.state.toWatchList}
			</div>

				<div class='paddedRow'>

					<div class='left-column'>
						<img src={"https://m.media-amazon.com/images/M"+this.props.path} alt={this.props.title} width="160" height="230"/>
					</div>

					<div class='middle-column'>
						<div class='row'>
							<a href={this.props.query}>{this.props.title}</a>
						</div>

						<div class='row'>
							Genres: {this.state.genresDisplay}
						</div>

						<div class='row'>
							Rating: {this.props.rating}
						</div>
						<br />

						<div class='row'>
							{this.props.overview}
						</div>
				  </div>

					<div class='right-column'>
						<div class='rightJustifiedrow'>Add to To-Watch List</div>
					 		<div className="checkbox">
								<label>
									<input type="checkbox" onClick={() => this.callbackFunction(<div class='paddedRow'> <img src={"https://m.media-amazon.com/images/M"+this.props.path} alt={this.props.title} width="160" height="230"/> </div>)}/>
								</label>
						  </div>
				 		</div>
					</div>

			</div>
		);
	};
};
