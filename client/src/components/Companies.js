import React from 'react';
import PageNavbar from './PageNavbar';
import CompaniesRow from './CompaniesRow';
import CompanyListRows from './CompanyListRows';
import RecommendationsRow from './RecommendationsRow';
import '../style/company.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CompanyButton from './CompanyButton';


export default class Companies extends React.Component {
    constructor(props) {
        super(props);

        // State maintained by this React component is the selected movie name, and the list of recommended movies.
        this.state = {
            pCompName: "",
            pCompanies: [],
            movies :[],
            current_company : "",


        };

        this.handlePCompNameChange = this.handlePCompNameChange.bind(this);
    
    };

    handlePCompNameChange(e) {
        this.setState({
            pCompName: e.target.value
        });
    };

    componentDidMount() {
       var url = "http://localhost:8081/pCompanyList";
        fetch(url,
        {
            method: 'GET'
        }).then(res => {
            return res.json();
        }, err => {
            console.log(err);
        }).then(keywordsList => {
            if (!keywordsList) return;
            const keywordsDivs = keywordsList.map((keywordObj, i) =>
                <CompanyButton
                id={"button-" + keywordObj.name}
                onClick={() => this.submitPCompany(keywordObj.name)}
                name={keywordObj.name}
                />
            );
            this.setState({
                pCompanies: keywordsDivs
            });
        });
    };




submitPCompany(pCompName) {
        console.log("TESTESTSEtstE");
    console.log(pCompName);

        var url = "http://localhost:8081/pCompany/" + pCompName;
        console.log(url)
        fetch(url,
        {
            method: 'GET'
        }).then(res => {
            return res.json();
        }, err => {
            console.log(err);
        }).then(pCompList => {
            if (!pCompList) return;
            const pCompDivs = pCompList.map((compObj, i) => 
                <CompaniesRow
                name={compObj.name}
                original_anguage = {compObj.original_language}
                rating = {compObj.rating}
                poster_path = {compObj.poster_path}
                companyName = {compObj.companyName}
                />
            );
       
            this.setState({
                 movies: pCompDivs,
                 current_company: pCompName
            });
            console.log(22222222)

        }, err => {
            console.log(err);
        });
    };




    
    render() {
        return (

<div className="Recommendations">
                <PageNavbar active="recommendations" />

                <div className="container recommendations-container">
                    <div className="jumbotron">
                        <div className="jumbotron-header">

                            <div className="h2">Production Company</div>
                            <br />

                           

                            <div className="h5">Search Movies by Company Name</div>
                            <br></br>
                        
                            
                            <div className="current_company"> {this.state.current_company}</div>
                                <br></br>

    
                            <div className="input-container">
                                <input type='text' placeholder="Enter a Production Company Name" value={this.state.pCompName} onChange={this.handlePCompNameChange} id="pCompName" className="pCompName-input"/>
                                <button id="submitKeywordBtn" className="submit-btn" onClick={() => this.submitPCompany(this.state.pCompName)} >Submit</button>
                            </div>

                            <br></br>
                            <br></br>

                            <div className="h5">Some Interesting Production Companies </div>


                            <div className="keywords-container">
                                {this.state.pCompanies}
                            </div>

                            <br></br>
                            <br></br>

                            <div className="h2">You may like ...</div>
                                
                            {this.state.movies}

                        </div>
                    </div>

                </div>
            </div>
    );
    };
};