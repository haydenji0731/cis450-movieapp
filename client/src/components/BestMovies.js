import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './BestMoviesRow';
import '../style/BestMovies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestMovies extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			selectedGenre: "",
			decades: [],
			genres: [],
			movies: []
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {
		fetch("http://localhost:8081/decades",
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(decadesList => {
			if (!decadesList) return;
			const decadesDivs = decadesList.map((decadeObj, i) =>
				<option className="decadesOption" value={decadeObj.decade}>
					{decadeObj.decade}
				</option>
			);
			this.setState({
				decades: decadesDivs
			});
		});
		fetch("http://localhost:8081/genres",
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(genresList => {
			if (!genresList) return;
			const genresDivs = genresList.map((genreObj, i) =>
			<option className="genresOption" value={genreObj.name}>
				{genreObj.name}
			</option>
			);
			this.setState({
				genres: genresDivs
			});
		});
	};

	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		this.setState({
			selectedDecade: e.target.value
		})
	};

	handleGenreChange(e) {
		this.setState({
			selectedGenre: e.target.value
		});
	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		var url = "http://localhost:8081/bestMovies/"+this.state.selectedDecade+"/"+this.state.selectedGenre;
		console.log(url)
		fetch(url,
			{
				method: 'GET'
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);
			}).then(bestMoviesList => {
				if (!bestMoviesList) return;
				const bestMoviesDivs = bestMoviesList.map((bestMovieObj, i) =>
				<BestMoviesRow
				title={bestMovieObj.title}
				id={bestMovieObj.movie_id}
				rating={bestMovieObj.rating}
				/>
				);
				this.setState({
					movies: bestMoviesDivs
				});
			}, err => {
				console.log(err);
			});
	};

	render() {
		return (
			<div className="BestMovies">
				
				<PageNavbar active="bestgenres" />

				<div className="container bestmovies-container">
					<div className="jumbotron">
						<div className="h5">Best Movies</div>
						<div className="dropdown-container">
							<select value={this.state.selectedDecade} onChange={this.handleDecadeChange} className="dropdown" id="decadesDropdown">
								{this.state.decades}
							</select>
							<select value={this.state.selectedGenre} onChange={this.handleGenreChange} className="dropdown" id="genresDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			          <div className="header"><strong>Title</strong></div>
			          <div className="header"><strong>Movie ID</strong></div>
								<div className="header"><strong>Rating</strong></div>
			        </div>
			        <div className="movies-container" id="results">
			          {this.state.movies}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
