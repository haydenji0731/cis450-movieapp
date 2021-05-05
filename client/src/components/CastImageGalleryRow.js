import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Recommendations.css';
import ModalPopUp from './ModalPopUp';

export default class CastImageGalleryRow extends React.Component {
	constructor(props) {
		super(props);
	};

	render() {
		return (
			<div>
			<div class="row">
				<div class="column">
						{this.props.firstMovie}
				</div>
				<div class="column">
						{this.props.secondMovie}
				</div>
				<div class="column">
						{this.props.thirdMovie}
					</div>
			</div>
			<br></br>
			<br></br>
			<br></br>
			<br></br>
			</div>
		);
	};
};
