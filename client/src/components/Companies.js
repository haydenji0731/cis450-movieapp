import React from 'react';
import PageNavbar from './PageNavbar';
import CompanyRow from './CompanyPart2Row';
import '../style/CompaniesPart2.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Popcorn from './popcorn.png';
import Trophy from './trophy.png';

export default class Companies extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pCompName: "",
            topFives: [],
            current_company : "",
        };

        this.handleActorChange = this.handleActorChange.bind(this);
        this.submitPComp = this.submitPComp.bind(this);
    };

    handleActorChange(e) {
        this.setState({
            pCompName: e.target.value
        });
        console.log(this.state);
    };

    /* ---- Q2 (Recommendations) ---- */
    // Hint: Name of movie submitted is contained in `this.state.movieName`.
    submitPComp(pCompName) {
        console.log(this.state.pCompName);
        var url = "http://localhost:8081/Company/" + this.state.pCompName;

        fetch(url, {
            method: "GET", // The type of HTTP request.
        })

        .then(res => res.json())
        .then(recList => {
            if (!recList) return;
            var compReturned = "";
            if (recList.length > 0){
                compReturned = recList[0].name;
            }
            let topDivs = recList.map((topFives, i) => (
                <CompanyRow key={i} className="CompanyRow" topFives = {topFives}/>
            ));


            this.setState({
                topFives: topDivs,
                current_company : compReturned,
            });
          })

          console.log(this.state);
          console.log("done");
          console.log(this.state.current_company);

    };


    render() {
        return (
            <>
            <div className="Actors">
                <PageNavbar active="actors" />

                <div className="container recommendations-container">
                    <div className="jumbotron">

                        <div className="popcorn" style={{textAlign: 'center'}}>
                            <img src = {Trophy} width="130" height="130"/>
                            <img src = {Popcorn} width="120" height="130"/>
                            <img src = {Trophy} width="130" height="130"/>
                        </div>
                        <br></br>
                        <div className="h5" style={{textAlign: 'center', fontSize: 60}}>Top Fives</div>
                        <br></br>
                        <div className="h5" style={{textAlign: 'center'}}>SEARCH BY COMPANY NAME</div>

                        <div className="input-container">
                        <div action="" class="search-bar">
                            <input type="text" value={this.state.pCompName} onChange={this.handleActorChange} id="actor" className="actor-input"></input>
                            <button id="submitActorBtn" class="search-btn" onClick={this.submitPComp}></button>
                        </div>
                        </div>
                        <br></br>
                        <div className="h5" style={{textAlign: 'center', fontSize: 60}}>Top Five Results for :</div>
                        <div className="h5" style={{textAlign: 'center', fontSize: 60}}>{this.state.current_company}</div>
                        <br></br>
                        <table style={{textAlign: 'center', height: 80, width: 1080, justifyContent: 'center'}}>
                            <thead className="actorsTable-header" style={{fontSize: 18}}>
                                <tr>
                                    <th colspan="2">Top 5 Most Profitable</th>
                                    <th colspan="2">Top 5 Rated</th>
                                    <th colspan="2">Top 5 Weighted Rated</th>
                                    <th colspan="2">Top 5 Genres</th>
                                     <th colspan="2">Top 5 Keywords</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.topFives}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </>
        );
    };
};
