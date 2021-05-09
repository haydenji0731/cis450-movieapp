import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Recommendations.css';

console.log(Logo);

export default class CastRecommendationsRow extends React.Component {
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
		this.getGenres(this.props.keyword, this.props.id);
	};

	componentDidUpdate(prevProps) {
	  if (this.props.id !== prevProps.id) {
	    this.getGenres(this.props.keyword, this.props.id);
	  }
	}

	callbackFunction(cast) {
		this.props.parentCallback(cast);
	};

  //this function gets the genres of the movies that the actor has acted in with the input keyword
	getGenres(keyword, cast_id) {
		var url = "http://localhost:8081/castGenres/"+keyword + "/" + cast_id;
		fetch(url,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(data => {
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
							<img src={"https://www.themoviedb.org/t/p/w200"+this.props.path} alt={this.props.name} width="240" height="345"/>
						</div>

						<div class="flip-display-back">
  						<div class="centered"><p className="boldText" style={{textAlign: 'center', fontSize: 25}}>{this.props.name}</p>
							<p>Keyword: {this.props.keyword}</p>
  						<p>Genres: {this.state.genresDisplay}</p></div>
						</div>
					</div>
				</div>
		);
	};
};
