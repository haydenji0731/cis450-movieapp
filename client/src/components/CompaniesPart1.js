import React from 'react';
import PageNavbar from './PageNavbar';
import CompanyListRows from './CompanyListRows';
import CompanyRecommendationsRow from './CompanyRecommendationsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CompanyButton from './CompanyButton';
import ImageGalleryRow from './ImageGalleryRow';

export default class CompaniesPart1 extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name, and the list of recommended movies.
		this.state = {
			company: "",
			recMovies: [],
			companies: [],
			imageGallery: [],
			recMoviesIds: [],
			recMoviesOverviews: [],
		};

		this.handleCompanyChange = this.handleCompanyChange.bind(this);
		this.submitPCompany = this.submitPCompany.bind(this);
		this.parentCallback = this.parentCallback.bind(this);
		this.createImageGallery = this.createImageGallery.bind(this);
	};

  componentDidMount() {
         var url = "http://localhost:8081/pCompanyList";
          fetch(url,
          {
              method: 'GET'
          }).then(res => {
              return res.json();
          }, err => {
              console.log(err);
          }).then(companiesList => {
              if (!companiesList) return;
              const companiesDivs = companiesList.map((companyObj, i) =>
              <div class='paddedColumn'>
      				<div><button id="button-" class="pushable" onClick={() => this.submitPCompany(companyObj.name)}>
      					<span class="front">{companyObj.name}</span>
      				</button> <br></br> <br></br> </div>
      				</div>
              );
              this.setState({
                  companies: companiesDivs
              });
          });
      };

      submitPCompany(pCompName) {
        var url = "http://localhost:8081/pCompany/" + pCompName;
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
            < CompanyRecommendationsRow
              id = {movieObj.id}
              title = {movieObj.title}
              overview = {movieObj.overview}
							companyName = {movieObj.companyName}
              rating = {movieObj.rating}
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

	handleCompanyChange(e) {
		console.log(e.target.value);
		this.setState({
			company: e.target.value
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
			<div className="CompaniesPart1">
				<PageNavbar active="CompaniesPart1" />
				<br />
				<div className="container recommendations-container">
					<div className="jumbotron">
						<div className="jumbotron-header">

							<div className="h3">MOVIE RECOMMENDATIONS</div>
							<br />

							<div className="input-container">
							<div action="" class="search-bar">
									<div className="h6">SEARCH BY COMPANY</div>
									<input type="text" value={this.state.company} onChange={this.handleCompanyChange} id="keywordName" className="keyword-input"></input>
									<button id="submitKeywordBtn" class="search-btn" onClick={() => this.submitPCompany(this.state.company)}></button>
							</div>
							</div>

							<br></br>
							<br></br>

							<div className="h5">BROWSE TOP PRODUCTION COMPANIES BY REVENUE</div>

							<br></br>

							<div className="keywords-container">
								{this.state.companies}
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
