import React from 'react';
import PageNavbar from './PageNavbar';
import CastRecommendationsRow from './CastRecommendationsRow';
import CastImageGalleryRow from './CastImageGalleryRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import KeywordButton from './KeywordRecPageButton';
import BG1 from './bg1.jpg';

export default class CastRecs extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name, and the list of recommended movies.
		this.state = {
			keyword: "",
			recCast: [],
			keywords: [],
			toWatchList: [],
			showToWatchList: [],
			originalDisplay: [],
			imageGallery: [],
			recCastIds: [],
			recCastProfiles: [],
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
			  <div class='paddedColumn'>
				<div><button id="button-" class="pushable" onClick={() => this.submitKeyword(keywordObj.keyword)}>
					<span class="front">{keywordObj.keyword}</span>
				</button> <br></br> <br></br> </div>
				</div>
			);
			this.setState({
				keywords: keywordsDivs
			});
		});
	};

	submitKeyword(keyword) {
		var url = "http://localhost:8081/castRecs/"+keyword;
		fetch(url,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(recsList => {
			if (recsList.ok) return;
				const recCastIdsIntermediate = [];
				const recCastProfilesIntermediate = [];
				for (var i = 0; i < recsList.length; i++) {
					recCastIdsIntermediate.push(recsList[i].id);
					recCastProfilesIntermediate.push(recsList[i].path);
				}
				const recsDivs = recsList.map((castObj, i) =>
				< CastRecommendationsRow
					id = {castObj.id}
					keyword = {castObj.keyword}
					name = {castObj.name}
					path= {castObj.path}
					gender = {castObj.gender}
					parentCallback = {this.parentCallback}
				/>
			);
			this.setState({
				recCast: recsDivs,
				recCastIds: recCastIdsIntermediate,
				recCastProfiles: recCastProfilesIntermediate
			}
		);
		this.createImageGallery();
		}, err => {
			console.log(err);
		});
	};

  createImageGallery() {
		var imageGalleryIntermediate = [];
		for (var i = 0; i < this.state.recCast.length; i = i + 3) {
			const oneMovie = < CastImageGalleryRow
				firstMovie = {this.state.recCast[i]}
				secondMovie = {this.state.recCast[i + 1]}
				thirdMovie = {this.state.recCast[i + 2]}
			/>;
			imageGalleryIntermediate.push(oneMovie);
		}
		this.setState({
			imageGallery: imageGalleryIntermediate
		})
	}

	handleKeywordChange(e) {
		console.log(e.target.value);
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
			<div className="Cast Recommendations">
				<PageNavbar active="Cast Recommendations"/>
				<br />
				<div className="container recommendations-container">
					<div className="jumbotron">
						<div className="jumbotron-header">

							<div className="h3">CAST RECOMMENDATIONS</div>
							<br />

							<div className="input-container">
							<div action="" class="search-bar">
									<div className="h6">SEARCH BY KEYWORD</div>
									<input type="text" value={this.state.keyword} onChange={this.handleKeywordChange} id="keywordName" className="keyword-input"></input>
									<button id="submitKeywordBtn" class="search-btn" onClick={() => this.submitKeyword(this.state.keyword)}></button>
							</div>
							</div>

							<br></br>
							<br></br>

							<div className="h5">BROWSE POPULAR KEYWORDS</div>

							<br></br>

							<div className="keywords-container">
								{this.state.keywords}
							</div>

							<br></br>
							<br></br>

						 	<div className="h3">YOU MAY LIKE...</div>
							<br></br>
								{this.state.imageGallery}
						 	</div>

					</div>
				</div>
			</div>
		);
	};
};


// <div class='left-column'>
// 	<button id="showToWatchListBtn" className="btn btn-4 btn-4a" onClick={() => this.showToWatchList()} >View My To-Watch List</button>
// </div>
