import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/MovieButton.css';

export default class KeywordButton extends React.Component {
	/* props looks like:
		{
			id
			onClick
			keyword
		}
	*/
	constructor(props) {
		super(props);

		this.props = {
			id: "",
			title: "",
			genre: "",
			overview: "",
			path: "",
			keyword: "",
		};
		this.state={
			genres: [],
			genresDisplay: []
		}
		this.callbackFunction = this.callbackFunction.bind(this);
		this.getGenres = this.getGenres.bind(this);
		this.showGenres = this.showGenres.bind(this);
	};

	componentDidMount() {
		this.getGenres(this.props.id);
	};

	componentDidUpdate(prevProps) {
		if (this.props.id !== prevProps.id) {
		  this.getGenres(this.props.id);
		}
	  }
	  
	callbackFunction(movie) {
		  this.props.parentCallback(movie);
	};

	getGenres(movie_id) {
		var url = "http://localhost:8081/genres/"+movie_id;
		fetch(url,
		{
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(data => {
		// Here you need to use an temporary array to store NeededInfo only
		let genresResult = []
		for (var i = 0; i < data.length; i++) {
			genresResult.push(data[i].genre);
		}
		this.setState({
				genres: genresResult
		})
		this.showGenres();
	});
	};

	showGenres() {
		const genresDisplayArr = [];
		for (var i = 0; i < this.state.genres.length; i++) {
			if (i == this.state.genres.length - 1) {
				genresDisplayArr.push(this.state.genres[i])
			}
			else {
				genresDisplayArr.push(this.state.genres[i].trim() + ", ")
			}
		};
		this.setState({
			genresDisplay: genresDisplayArr
		});
		// console.table(this.state.genresDisplay);
	};


	render() {
		return (
			// <div className="keyword" id={this.props.id} onClick={this.props.onClick}>
			<div className="movie">
				{/* {this.props.title} */}
				<img src={"https://m.media-amazon.com/images/M"+this.props.path} 
				alt = {this.props.title} width="160" height="230" />
				<div className="movie__data">
					<div className="movie__title">{this.props.title}</div>
					<div className="movie__genres">{this.state.genresDisplay}</div>
					<div className="movie__summary">{this.props.overview}</div>
				</div>
                {/* <div class='moviebutton-container'>
					<div class='flex-child-left'>
                      	<img src={"https://m.media-amazon.com/images/M"+this.props.path} 
						//   onError={imgError(this)}
						  alt = {this.props.title} width="160" height="230" />
               		</div>
					<div class='flex-child-right'>
						<div class='row'>
						<div className="header"><strong>
							{this.props.title}
						</strong></div>	
                    	</div>
                    	<div class='row'>
							Genres: {this.state.genresDisplay}
                    	</div>
						<br />
						<div class='row'>
                        	{this.props.overview}
                    	</div>
					</div>
				</div> */}
			</div>
		);
	};
};