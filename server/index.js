const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');
var mysql = require('mysql');


const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
app.get('/dashboard', routes.getTopMovies);

app.get('/dashboard/:movie', routes.getAssociatedStars);

/* ---- (Recommendations) ---- */
app.get('/keywordsDropdown', routes.getKeywords);

//get movie recommendations based on keyword search
app.get('/recs/:keyword', routes.getRecs);

app.get('/genres/:movie_id', routes.getGenres);

app.get('/overviews/:movie_id', routes.getOverviews);

app.get('/castRecs/:keyword', routes.getCastRecs);
app.get('/castGenres/:keyword/:cast_id', routes.getCastGenres);

/* -- Actors -- */
app.get('/actors/:actor', routes.getTopFives);

/* -- Companies -- */
app.get('/Company/:companyName', routes.getTopFiveCompany);

app.get('/pCompany/:pCompName', routes.getPCompany);
app.get('/pCompanyList', routes.getTopPCompanies);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
