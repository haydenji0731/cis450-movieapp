import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Recommendations.css';
import '../style/NavBar.css';
import Logo from './pennFlix_web.png'

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		};
	};

	// deleted best movies tab --> artificat of hw2 template file
	componentDidMount() {
		const pageList = ['dashboard', 'recommendations', 'filter', 'companies', 'actors'];

		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return <a className="nav-item nav-link active" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			} else {
				return <a className="nav-item nav-link" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
		});

		this.setState({
			navDivs: navbarDivs
		});
	};

	render() {
		return (
			<div class="netflix-sans-font-loaded">
			<div className="PageNavbar">
			<nav className="navbar navbar-expand-sm navbar-custom">
			<span className="navbar-brand center">
			<img src={Logo} alt="website logo" width="110" height="45"/>
			</span>
			<div class="container-fluid">
			  <nav class="navbar navbar-inverse">
			    <div class="container-fluid">
			      <ul class="nav navbar-nav">
						  <button type="button" href="/dashboard" class="btn btn-primary">{this.state.navDivs[0]}</button>
							<button type="button" href="/recommendations" class="btn btn-primary">{this.state.navDivs[1]}</button>
							<button type="button" href="/filter" class="btn btn-primary">{this.state.navDivs[2]}</button>
							<button type="button" href="/companies" class="btn btn-primary">{this.state.navDivs[3]}</button>
							<button type="button" href="/actors" class="btn btn-primary">{this.state.navDivs[4]}</button>
			      </ul>
			    </div>
			  </nav>
			</div>
			</nav>
			</div>
			</div>
    );
	};
};
