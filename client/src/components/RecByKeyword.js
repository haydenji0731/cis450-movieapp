import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import ImageGalleryRow from './ImageGalleryRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import KeywordButton from './KeywordRecPageButton';

export default class RecByKeyword extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name, and the list of recommended movies.
		this.state = {
			keyword: "",
			recMovies: [],
			keywords: [],
			toWatchList: [],
			showToWatchList: [],
			originalDisplay: [],
			imageGallery: [],
			recMoviesIds: [],
		};

		this.handleKeywordChange = this.handleKeywordChange.bind(this);
		this.submitKeyword = this.submitKeyword.bind(this);
		this.parentCallback = this.parentCallback.bind(this);
		this.createImageGallery = this.createImageGallery.bind(this);
	};

	componentDidMount() {
		fetch("http://localhost:8081/keywordsDropdown",
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(keywordsList => {
			if (!keywordsList) return;
			const keywordsDivs = keywordsList.map((keywordObj, i) =>
				<KeywordButton
				id={"button-" + keywordObj.keyword}
				onClick={() => this.submitKeyword(keywordObj.keyword)}
				keyword={keywordObj.keyword}
				/>
			);
			this.setState({
				keywords: keywordsDivs
			});
		});
	};

	submitKeyword(keyword) {
		var url = "http://localhost:8081/recs/"+keyword;
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
				for (var i = 0; i < recsList.length; i++) {
					recMoviesIdsIntermediate.push(recsList[i].id);
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
				recMoviesIds: recMoviesIdsIntermediate
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
			/>;
			imageGalleryIntermediate.push(oneMovie);
		}
		this.setState({
			imageGallery: imageGalleryIntermediate
		})
	}

	handleKeywordChange(e) {
		this.setState({
			keyword: e.target.value
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
			<div className="Recommendations">
				<PageNavbar active="Recommendations" />
				<br />
				<div className="container recommendations-container">
					<div className="jumbotron">
						<div className="jumbotron-header">

							<div className="h2">Movie Recommendations</div>
							<br />

							<div className="h5">Search by Keyword</div>
							<br></br>

							<div class='paddedRow'>
								<div class='left-column'>
									<div className="input-container">
										<input type='text' placeholder="Enter Keyword" value={this.state.keyword} onChange={this.handleKeywordChange} id="keywordName" className="keyword-input"/>
									</div>
								</div>

								<div class='middle-column'>
									<button id="submitKeywordBtn" className="submit-btn" onClick={() => this.submitKeyword(this.state.keyword)} >Submit</button>
								</div>

								<div class='right-column'>
									<button id="showToWatchListBtn" className="submit-btn" onClick={() => this.showToWatchList()} >View My To-Watch List</button>
								</div>
							</div>

							<div className="h5">Browse Interesting Keywords</div>

							<div className="keywords-container">
								{this.state.keywords}
							</div>

							<br></br>
							<br></br>

						 	<div className="h2">You may like ...</div>
								{this.state.imageGallery}
						 	</div>

							<br></br>
							<br></br>

						 <div className="h2">To-Watch List</div>
							{this.state.showToWatchList}
							{this.state.genresDisplay}

					</div>
				</div>
			</div>
		);
	};
};
