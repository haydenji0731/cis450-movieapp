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
			keyword: ""
		};
	};


	render() {
		return (
			<div className="keyword" id={this.props.id} onClick={this.props.onClick}>
				{/* {this.props.title} */}
                <div class='moviebutton-container'>
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
                        	Genres: {this.props.genre}
                    	</div>
						<br />
						<div class='row'>
                        	{this.props.overview}
                    	</div>
					</div>
				</div>
			</div>
		);
	};
};