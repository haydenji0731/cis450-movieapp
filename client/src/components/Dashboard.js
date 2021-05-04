import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import MovieButton from './MovieButton';
import DashboardMovieRow from './DashboardMovieRow';
import Banner from './Banner';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: [],
      movies: [],
      banner: "",
    };

    this.trailer="";
    this.showMovies = this.showMovies.bind(this);
  };

  componentDidMount() {
    fetch("http://localhost:8081/keywords",
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(keywordsList => {
      if (!keywordsList) return;
      const keywordsDivs = keywordsList.map((keywordObj, i) =>
        <MovieButton
          id={keywordObj.movie_id} 
          onClick={() => this.showMovies(keywordObj.movie)} 
          title={keywordObj.movie} 
          genre={keywordObj.genre}
          overview={keywordObj.overview}
          path={keywordObj.path}
        /> 
      );

      var bannerObj = keywordsList[Math.floor(Math.random() * (keywordsList.length - 1))];
      console.log(bannerObj);
      const front_banner = <Banner id={bannerObj.movie_id}
      title = {bannerObj.movie}
      overview={bannerObj.overview}
      path={bannerObj.back_path}
      />;
      this.setState({
        banner: front_banner,
        keywords: keywordsDivs
      });
    }, err => {
      console.log(err);
    });
  };

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

  // TODO: add links to other pages (href)
  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
        {this.state.banner}

        <div class="netflix-sans-font-loaded">
        <br></br>
        <br></br>
        <h2>Top Ranking Movies</h2>
        <div className="movies">
              {this.state.keywords}
        </div>
        <h2>Hello, World!</h2>
        Enjoy movies from different parts of the world. We all miss traveling.
        </div>
      </div>
    );
  };
};

