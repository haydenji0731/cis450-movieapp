import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import '../style/Banner.css';

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
        this.showTrailer = this.showTrailer.bind(this);
    };

    showTrailer() {
        var query='https://www.youtube.com/results?search_query='+this.props.title.replace(" ", "+")+'trailer'
        window.location = query;
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