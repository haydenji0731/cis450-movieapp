import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './logo.png';
import '../style/Recommendations.css';
import ModalPopUp from './ModalPopUp';

export default class ImageGalleryRow extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			firstOverview:'',
			secondOverview:'',
			thirdOverview:'',
		};
	};

		handleFirstLeave=()=>{
			return this.setState({firstOverview:''})
		}

		handleFirstHover=()=>{
			console.log(this.props.firstMovieOverview);
			this.setState({
				firstOverview: <div class="modal-content">
				  						   <div class="modal-body">
														<br></br>
				    									<p>Overview: {this.props.firstMovieOverview}</p>
				  							 </div>
											 </div>
			})
		}

		handleSecondLeave=()=>{
			return this.setState({secondOverview:''})
		}

		handleSecondHover=()=>{
			this.setState({
				secondOverview: <div class="modal-content">
				  						   <div class="modal-body">
														<br></br>
				    									<p>Overview: {this.props.secondMovieOverview}</p>
				  							 </div>
											 </div>
			})
		}

		handleThirdLeave=()=>{
			return this.setState({thirdOverview:''})
		}

		handleThirdHover=()=>{
			this.setState({
				thirdOverview: <div class="modal-content">
												 <div class="modal-body">
														<br></br>
															<p>Overview: {this.props.thirdMovieOverview}</p>
												 </div>
											 </div>
			})
		}

	render() {
		return (
			<div>
			<div class="paddedRow">
  				<div class="column">
						<div className="modal__wrapper">
							<div className="modal__relevance" onMouseOver={e => {this.handleFirstHover();}} onMouseLeave={this.handleFirstLeave}>
								{this.props.firstMovie}
								{this.state.firstOverview}
							</div>
						</div>
					</div>
  				<div class="column">
						<div className="modal__wrapper">
							<div className="modal__relevance" onMouseOver={e => {this.handleSecondHover();}} onMouseLeave={this.handleSecondLeave}>
								{this.props.secondMovie}
								{this.state.secondOverview}
							</div>
						</div>
				  </div>
  				<div class="column">
						<div className="modal__wrapper">
							<div className="modal__relevance" onMouseOver={e => {this.handleThirdHover();}} onMouseLeave={this.handleThirdLeave}>
								{this.props.thirdMovie}
								{this.state.thirdOverview}
							</div>
						</div>
  				</div>
			</div>
			</div>
		);
	};
};
