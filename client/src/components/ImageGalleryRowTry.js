import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Try.css';
import ModalPopUp from './ModalPopUp';

export default class ImageGalleryRowTry extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			overviewDisplay: [],
		};

		this.displayOverview = this.displayOverview.bind(this);
	};

	displayOverview(movie_id) {
		var overviewDisplayIntermediate = [];
		const movieModal = <ModalPopUp
				movie_id = {movie_id}
		/>;
		overviewDisplayIntermediate.push(movieModal);
		this.setState({
			overviewDisplay: overviewDisplayIntermediate
		})
	}

	render() {
		return (
			<div class="paddedRow">
  				<div class="column">
							<button className="btn" onClick={() => this.displayOverview(this.props.firstMovieId)} >{this.props.firstMovie}</button>
					</div>
  				<div class="column">
    					{this.props.secondMovie}
  			  </div>
  				<div class="column">
    					{this.props.thirdMovie}
  				</div>
					{this.props.overviewDisplay}
			</div>
		);
	};
};
