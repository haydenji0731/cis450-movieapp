import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/MovieButton.css';
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import DashboardMovieRow from './DashboardMovieRow';

export default class KeywordButton extends React.Component {
	constructor(props) {
		super(props);

		this.props = {
			id: "",
			title: "",
			genre: "",
			overview: "",
			path: "",
			keyword: "",
			onClick: "",
		};

		this.state = {
			genres: [],
			genresDisplay: []
		}
		this.callbackFunction = this.callbackFunction.bind(this);
		this.getGenres = this.getGenres.bind(this);
		this.showGenres = this.showGenres.bind(this);
		this.showTrailer = this.showTrailer.bind(this);
		this.showInfo = this.showInfo.bind(this);
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

	showTrailer() {
		var query='https://www.youtube.com/results?search_query='+this.props.title.replace(" ", "+")+'trailer'
        window.location = query;
	}

	showInfo(movie) {
		var url = "http://localhost:8081/keywords/" + movie;
		console.log(url);
		fetch(url,
		  {
			method: 'GET'
		  }).then(res => {
			return res.json();
		  }, err => {
			console.log(err);
		  }).then(moviesList => {
			if (!moviesList) return;
			const moviesDivs = moviesList.map((movieObj, i) =>
			<DashboardMovieRow
				movie = {movieObj.name}
				overview = {movieObj.profile_path}
			  />
			);
		  this.setState({
			movies: moviesDivs
		  });
		}, err => {
		  console.log(err);
		});
	}


	render() {
		return (
			<div className="movie" id={this.props.id} onClick={this.props.onClick}>
				<div className="movie__poster">
					<img src={"https://m.media-amazon.com/images/M"+this.props.path} 
					alt = {this.props.title} 
					width="160" height="230" />
				</div>
				<div className="movie__data">
					<div className="movie__title">{this.props.title}</div>
					<div className="movie__genres">{this.state.genresDisplay}</div>
					<div className="movie__summary">{this.props.overview}</div>
				</div>
				<div className="banner__buttons">
                    <button className="banner__button play" onClick={this.showTrailer}><PlayArrowIcon />Watch Trailer</button>
                </div>
			</div>
		);
	};
};
