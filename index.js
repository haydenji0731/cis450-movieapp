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
// The route localhost:8081/keywords is registered to the function
// routes.getTop20Keywords, specified in routes.js.
app.get('/keywords', routes.getTop20Keywords);

/* ---- Q1b (Dashboard) ---- */
app.get('/keywords/:keyword', routes.getTopMovies);

/* ---- Q2 (Recommendations) ---- */
// check if the uid portion is correct
app.get('/keywordsDropdown', routes.getKeywords);

//get movie recommendations based on keyword search
app.get('/recs/:keyword', routes.getRecs);

/* ---- (Best Movies) ---- */
app.get('/decades', routes.getDecades);
app.get('/genres/:movie_id', routes.getGenres);


/* ---- Q3b (Best Movies) ---- */

app.get('/bestMovies/:decade/:genre', routes.bestMoviesPerDecadeGenre);

/* -- Actors -- */
app.get('/actors/:actor', routes.getTopFives);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
