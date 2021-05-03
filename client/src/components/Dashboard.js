import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import KeywordButton from './KeywordButton';
import MovieButton from './MovieButton';
import DashboardMovieRow from './DashboardMovieRow';
import Logo from './logo.png';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of keywords,
    // and a list of movies for a specified keyword.
    this.state = {
      keywords: [],
      movies: [],
    };

    this.trailer="";
    this.showMovies = this.showMovies.bind(this);
    this.showTrailer = this.showTrailer.bind(this);
  };

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/keywords",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(keywordsList => {
      if (!keywordsList) return;

      // Map each keyword in this.state.keywords to an HTML element:
      // A button which triggers the showMovies function for each keyword.
      const keywordsDivs = keywordsList.map((keywordObj, i) =>
        <MovieButton
          id={keywordObj.movie_id} 
          // TODO: implment onClick() behavior
          onClick={() => this.showMovies(keywordObj.movie)} 
          title={keywordObj.movie} 
          genre={keywordObj.genre}
          overview={keywordObj.overview}
          path={keywordObj.path}
        /> 
      );

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        keywords: keywordsDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  };

  // TODO: implement click functionality 
  showTrailer() {
    console.log("blah");
  }

  showMovies(keyword) {
    var url = "http://localhost:8081/keywords/" + keyword;
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
  };

  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
        <div className="movies">
              {this.state.keywords}
        </div>
        <br />
        <div className="container movies-container">
          {/* <div className="jumbotron">
            <div className="h5">Top Movies</div>
            {/* <div className="movies">
              {this.state.keywords}
            </div> */}
          {/* </div> */}
          <br />
          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
              <div className="h5"> Who's in it? </div>
                {/* <div className="header"><strong>Rating</strong></div>
                <div className="header"><strong>Vote Count</strong></div> */}
              </div>
              <div className="results-container" id="results">
                {this.state.movies}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

