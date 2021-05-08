import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import '../style/Banner.css';
import YTSearch from '../../node_modules/youtube-api-search';

let API_KEY = 'AIzaSyApDeq7qviPLrxTpuaBIWRh2gVu0lkcI94'

export default class Banner extends React.Component {
        constructor(props) {
		    super(props);

        this.props = {
            id: "",
            title: "",
            path: "",
            overview: "",
            query: "",
        };

        this.state = {
          videos: [],
          displayVideo: '',
        }

        this.showTrailer = this.showTrailer.bind(this);
        this.videoSearch = this.videoSearch.bind(this);
    };

    videoSearch(term) {
      console.log(term);
      YTSearch({key: API_KEY, term: term}, (videos) => {
        console.log("youtube search");
        this.setState({
          videos: videos,
          displayVideo: "https://www.youtube.com/watch?v="+videos[0].id.videoId,
        });
        window.location = this.state.displayVideo;
      })
    }

    showTrailer() {
        console.log(this.state.displayVideo);
        //this.videoSearch(this.props.title + ' movie trailer');
    }

    render () {
        return (
            <header className="banner"
            style={{
                backgroundImage : `url(
                    "https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces${this.props.path}"
                    )`,
                backgroundPosition : "top center",
                backgroundSize: "cover",
            }}
        >
            <div className="banner__contents">
                <h1 className="banner__title">{this.props.title}</h1>
                <div className="banner__buttons">
                    <button className="banner__button play" onClick={this.showTrailer}><PlayArrowIcon />Watch Trailer</button>
                </div>
                <h1 className="banner__description">{this.props.overview}</h1>
            </div>
            <div className="banner--fadeBottom"/>
        </header>
        )
    }
}
