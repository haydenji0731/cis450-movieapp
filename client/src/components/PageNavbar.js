import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Recommendations.css';
import '../style/NavBar.css';
import Logo from './pennFlix_web.png'

console.log(Logo);

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		};
	};

	// deleted best movies tab --> artificat of hw2 template file
	componentDidMount() {
		const pageList = ['dashboard', 'movie Recommendations', 'Cast Recommendations', 'companiesPart1', 'rec Genres', 'actors', 'companies'];

		let navbarDivs = pageList.map((page, i) => {
			if (page != 'movie Recommendations') {
			if (this.props.active === page) {
				return <a className="nav-item nav-link active" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			} else {
				return <a className="nav-item nav-link" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
		}
		});

		this.setState({
			navDivs: navbarDivs
		});
	};

	render() {
		return (
			<div className="PageNavbar">
			<br></br>
			<nav className="navbar navbar-expand-sm navbar-custom">
			<img src={Logo} alt="website logo" width="130" height="60" style={{marginLeft: 35}}/>
			<div class="container-fluid">
			  <nav class="navbar navbar-inverse">
			    <div class="container-fluid">
			      <ul class="nav navbar-nav">
						  <button type="button" href="/dashboard" class="btn btn-danger">{this.state.navDivs[0]}</button>
							<div class="dropdown">
								<button class="btn btn-danger"><a className="nav-item nav-link active">MOVIE RECOMMENDATIONS</a></button>
								<div class="dropdown-content">
									<a href="/recommendations">Recommend by Keyword</a>
									<a href="/companiesPart1">Recommend by Production Company</a>
								</div>
							</div>
							<button type="button" href="/castRecs" class="btn btn-danger">{this.state.navDivs[2]}</button>
							<button type="button" href="/actors" class="btn btn-danger">{this.state.navDivs[5]}</button>
							<button type="button" href="/companies" class="btn btn-danger">{this.state.navDivs[6]}</button>
			      </ul>
			    </div>
			  </nav>
			</div>
			</nav>
			</div>
    );
	};
};
