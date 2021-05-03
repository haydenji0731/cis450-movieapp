import React from 'react';
import PageNavbar from './PageNavbar';
import TryRow from './TryRow';
import ImageGalleryRowTry from './ImageGalleryRowTry';
import '../style/Try.css';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import KeywordButton from './KeywordRecPageButton';
import ModalPopUp from './ModalPopUp';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Link, NavLink, Route } from 'react-router-dom';
import BG1 from './bg1.jpg';

export default class Try extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			likeList:'',
		};

	};

	showModal = e => {
	    this.setState({
	      show: !this.state.show
	   });
	 };

	componentDidMount() {
	};

  renderLikeList = () =>{
    return <div className="likes__list" >Likes to be rendered specifically</div>
  }

  handleLeave=()=>{
    return this.setState({likeList:''})
  }

  handleHover=()=>{
    return this.setState({likeList:this.renderLikeList()})
  }

	render() {
		return (
			<div className="Try">
				<PageNavbar active="Try" />
				<br />
					<div class="container">
						<div class="button">
						<a href="/recommendations">Search by Keyword</a>
						</div>
						<button class="btn btn-4 btn-4a">Button Style 4</button>
						<button class="btn btn-1 btn-1e">Button Style 1</button>
						<button class="pushable">
							<span class="front">Push me</span>
						</button>
					</div>
			</div>
		);
	};
};
