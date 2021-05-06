import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import MovieButton from './MovieButton';
import DashboardStarRow from './DashboardStarRow';
import Banner from './Banner';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: [],
      movies: [],
      banner: "",
    };

    this.trailer="";
    this.showActors = this.showActors.bind(this);
  };

  componentDidMount() {
    fetch("http://localhost:8081/dashboard",
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
          onClick={() => this.showActors(keywordObj.movie)} 
          title={keywordObj.movie} 
          genre={keywordObj.genre}
          overview={keywordObj.overview}
          path={keywordObj.path}
        /> 
      );

      var bannerObj = keywordsList[Math.floor(Math.random() * (keywordsList.length - 1))];
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

  showActors(movie) {
    var url = "http://localhost:8081/dashboard/" + movie;
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
        <DashboardStarRow
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

  moveToRec() {
    window.location.href="/recommendations";
  }

  moveToProdComp() {
    window.location.href="/companies";
  }

  moveToActors() {
    window.location.href="/Actor%20Top%20Fives";
  }
  
  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />
        {this.state.banner}

        <div class="netflix-sans-font-loaded">
        <br></br><br></br><br></br>
        <h2>Top Ranking Movies</h2>
        <div className="movies">
              {this.state.keywords}
        </div>
        <h2>Who's In It?</h2>
        <div class="netflix-sans-font-loaded">
        <div className="movies">
              {this.state.movies}
        </div>
        <br></br><br></br>
        <div className="movies">
        <button className="more__button" onClick={this.moveToRec}>
          Get More Recommendations<ArrowForwardIosIcon /></button>
        <button className="more__button" onClick={this.moveToProdComp}>
          Browse By Production Companies<ArrowForwardIosIcon /></button>
          <button className="more__button" onClick={this.moveToActors}>
          Browse By Actors / Actresses<ArrowForwardIosIcon /></button>
          </div>
        </div>
        </div>
        <br></br><br></br><br></br><br></br>
      </div>
    );
  };
};


