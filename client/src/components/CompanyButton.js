import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/company.css';

export default class CompanyButton extends React.Component {

	render() {
		return (
			<div className="pCompany" id={this.props.name} onClick={this.props.onClick}>
				{this.props.name}
			</div>
		);
	};
};
