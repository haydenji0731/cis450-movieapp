import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import ImageGalleryRow from './ImageGalleryRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import KeywordButton from './KeywordRecPageButton';
import BG1 from './bg1.jpg';

export default class RecGenre extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			genre: "",
			recMovies: [],
			genres: [],
			toWatchList: [],
			showToWatchList: [],
			originalDisplay: [],
			imageGallery: [],
			recMoviesIds: [],
			recMoviesOverviews: [],
		};

		this.handleGenreChange = this.handleGenreChange.bind(this);
		this.submitGenre = this.submitGenre.bind(this);
		this.parentCallback = this.parentCallback.bind(this);
		this.createImageGallery = this.createImageGallery.bind(this);
	};

	componentDidMount() {
		fetch("http://localhost:8081/genresDropdown",
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(genreList => {
			if (!genreList) return;
			const genreDivs = genreList.map((genreObj, i) =>
			  <div class='paddedColumn'>
				<div><button id="button-" class="pushable" onClick={() => this.submitGenre(genreObj.genre)}>
					<span class="front">{genreObj.genre}</span>
				</button> <br></br> <br></br> </div>
				</div>
			);
			this.setState({
				genres: genreDivs
			});
		});
	};

	submitGenre(genre) {
		var url = "http://localhost:8081/recs/"+genre;
		fetch(url,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(recsList => {
			if (recsList.ok) return;
				const recMoviesIdsIntermediate = [];
				const recMoviesOverviewsIntermediate = [];
				for (var i = 0; i < recsList.length; i++) {
					recMoviesIdsIntermediate.push(recsList[i].id);
					recMoviesOverviewsIntermediate.push(recsList[i].overview);
				}
				const recsDivs = recsList.map((movieObj, i) =>
				< RecommendationsRow
					id = {movieObj.id}
					title = {movieObj.title}
					overview = {movieObj.overview}
					genre = {movieObj.genre}
					rating = {movieObj.rating}
					query = {movieObj.query}
					path= {movieObj.path}
					parentCallback = {this.parentCallback}
				/>
			);
			this.setState({
				recMovies: recsDivs,
				recMoviesIds: recMoviesIdsIntermediate,
				recMoviesOverviews: recMoviesOverviewsIntermediate
			}
		);
		this.createImageGallery();
		}, err => {
			console.log(err);
		});
	};

  createImageGallery() {
		var imageGalleryIntermediate = [];
		for (var i = 0; i < this.state.recMovies.length; i = i + 3) {
			const oneMovie = < ImageGalleryRow
				firstMovie = {this.state.recMovies[i]}
				secondMovie = {this.state.recMovies[i + 1]}
				thirdMovie = {this.state.recMovies[i + 2]}

				firstMovieId= {this.state.recMoviesIds[i]}
				secondMovieId = {this.state.recMoviesIds[i + 1]}
				thirdMovieId = {this.state.recMoviesIds[i + 2]}

				firstMovieOverview= {this.state.recMoviesOverviews[i]}
				secondMovieOverview = {this.state.recMoviesOverviews[i + 1]}
				thirdMovieOverview = {this.state.recMoviesOverviews[i + 2]}
			/>;
			imageGalleryIntermediate.push(oneMovie);
		}
		this.setState({
			imageGallery: imageGalleryIntermediate
		})
	}

	handleGenreChange(e) {
		console.log(e.target.value);
		this.setState({
			Genre: e.target.value
		})
	};

	parentCallback(movie) {
    this.setState({
			toWatchList: this.state.toWatchList.concat(movie)
		})
	};

	showToWatchList() {
		this.setState({
			showToWatchList: this.state.toWatchList
		});
	};

	render() {
		return (
			<div className="RecGenre">
				<PageNavbar active="RecGenre"/>
				<br />
				<div className="container recommendations-container">
					<div className="jumbotron">
						<div className="jumbotron-header">

							<div className="h3">MOVIE RECOMMENDATIONS</div>
							<br />

							<div className="input-container">
							<div action="" class="search-bar">
									<div className="h6">SEARCH BY GENRE</div>
									<input type="text" value={this.state.Genre} onChange={this.handleGenreChange} id="GenreName" className="Genre-input"></input>
									<button id="submitGenreBtn" class="search-btn" onClick={() => this.submitGenre(this.state.Genre)}></button>
							</div>
							</div>

							<br></br>
							<br></br>

						 	<div className="h3">YOU MAY LIKE...</div>
								{this.state.imageGallery}
						 	</div>

					</div>
				</div>
			</div>
		);
	};
};
