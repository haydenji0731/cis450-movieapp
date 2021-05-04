const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- (Dashboard) ---- */

const getTopMovies = (req, res) => {
  var query = `WITH intermediate AS (SELECT m.movie_id, m.movie_title as movie, m.overview, m.poster_path as path, m.back_path FROM movies m
    WHERE m.vote_count > (SELECT AVG(vote_count) FROM movies)
    ORDER BY m.vote_average DESC, m.movie_title LIMIT 10)
    SELECT m.movie, m.overview, g.genre, m.path, m.movie_id, m.back_path FROM intermediate m JOIN movie_genre mg ON mg.movie_id = m.movie_id JOIN genre g ON g.genre_id = mg.genre_id GROUP BY m.movie;`;
      connection.query(query, function(err, rows, field) {
        if (err) console.log(err);
        else {
          console.log(rows);
          res.json(rows);
        }
      });
    };

const getAssociatedStars = (req, res) => {
  var movie = req.params.movie;
  var query=`WITH tmp AS (SELECT s.cast_id AS cast_id FROM movies m JOIN stars s ON m.movie_id = s.movie_id WHERE m.movie_title LIKE '%${movie}%')
            SELECT a.cast_id, a.name, a.gender, a.profile_path FROM actors a JOIN tmp on a.cast_id = tmp.cast_id LIMIT 5;`;
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- (Recommendations) ---- */

const getKeywords = (req, res) => {
var query = `WITH highest_ranked AS (SELECT movie_id, movie_title, vote_average FROM movies
             ORDER BY vote_average DESC LIMIT 600),
             highest_rev AS (SELECT movie_id, movie_title, revenue
             FROM movies ORDER BY revenue DESC LIMIT 600),
             movie_keywords AS (SELECT m.movie_id, k.keyword, m.vote_average FROM movies m
             JOIN about a ON m.movie_id = a.movie_id
             JOIN keyword k ON k.keyword_id = a.keyword_id) SELECT keyword FROM movie_keywords
             WHERE movie_id IN (SELECT movie_id FROM highest_ranked) ORDER BY vote_average DESC, keyword LIMIT 30;`;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

const getRecs = (req, res) => {
  var keyword = req.params.keyword;
  var query =   `WITH movie_keywords AS (SELECT m.movie_id, m.movie_title, k.keyword FROM movies m JOIN about ab ON
  		           m.movie_id = ab.movie_id JOIN keyword k ON ab.keyword_id = k.keyword_id),
                 rec_movie AS (SELECT m.movie_id, m.poster_path, m.movie_title, m.overview, mk.keyword, m.vote_average FROM movies m JOIN movie_keywords mk ON m.movie_title = mk.movie_title WHERE mk.keyword LIKE '%${keyword}%'),
  		           movie_genres AS (SELECT m.movie_id, m.movie_title as title, m.overview, m.vote_average, g.genre FROM movies m JOIN movie_genre mg ON mg.movie_id = m.movie_id JOIN genre g ON g.genre_id = mg.genre_id GROUP BY m.movie_id)
                 SELECT m.movie_id as id, m.poster_path as path, m.movie_title as title, m.overview, m.vote_average as rating, g.genre, CONCAT(CONCAT('https://www.youtube.com/results?search_query=', REPLACE(m.movie_title, " ", "+")), '+trailer') as query
                 FROM rec_movie m
                 JOIN movie_genres g ON m.movie_title = g.title
                 WHERE m.vote_average <= 10
                 GROUP BY m.movie_title
                 ORDER BY m.vote_average DESC, m.movie_title
                 LIMIT 10;`;
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* ---- Q3a (Best Movies) ---- */
const getDecades = (req, res) => {
  const query = `
  SELECT DISTINCT release_year - MOD(release_year, 10) AS decade FROM movie ORDER BY decade ASC;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  })

};


/* ---- (Best Movies) ---- */
const getGenres = (req, res) => {
  var movie_id = req.params.movie_id;
  var query = `WITH intermediate AS (SELECT m.movie_id, m.movie_title as movie, m.overview, m.vote_average as rating FROM movies m)
               SELECT DISTINCT g.genre
               FROM intermediate m
               JOIN movie_genre mg ON mg.movie_id = m.movie_id
               JOIN genre g ON g.genre_id = mg.genre_id
               WHERE m.movie_id = ${movie_id}
               ORDER BY g.genre;`;
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* ---- Q3b (Best Movies) ---- */
const bestMoviesPerDecadeGenre = (req, res) => {
  var decade = req.params.decade;
  var genre = req.params.genre;
  const query = `
  WITH a AS (SELECT movie.title, movie_genre.movie_id, movie_genre.genre_name, movie.rating, movie.release_year - MOD(movie.release_year, 10) AS decade
  FROM movie_genre JOIN movie ON movie_genre.movie_id = movie.movie_id),
  b AS (SELECT genre_name, AVG(rating) AS avg_rating FROM a WHERE a.decade = '${decade}' GROUP BY genre_name),
  c AS (SELECT title, movie_id, genre_name, rating FROM a WHERE a.decade = '${decade}' AND a.genre_name = '${genre}'),
  d AS (SELECT c.title, c.movie_id, a.genre_name, a.rating, a.decade
    FROM c JOIN a WHERE c.movie_id = a.movie_id AND c.title = a.title),
  e AS (SELECT DISTINCT d.movie_id FROM d, b WHERE d.genre_name = b.genre_name AND d.rating < b.avg_rating),
  f AS (SELECT DISTINCT d.movie_id FROM d WHERE d.movie_id NOT IN (SELECT movie_id FROM e))
  SELECT DISTINCT movie.movie_id, movie.title, movie.rating FROM movie, f WHERE f.movie_id = movie.movie_id
  ORDER BY title ASC LIMIT 100;
  `;
  connection.query(query, (err, rows, fields) => {
    if (err) console.log(err);
    else res.json(rows);
  })
};

/*-- Actors -- */
const getTopFives = (req, res) => {
  var actor = req.params.actor;

  const query = `WITH co_stars AS (SELECT s1.cast_id AS actor_id, s2.cast_id AS costar_id, a1.name AS actor, a2.name AS costar
    FROM stars s1 
      JOIN stars s2 ON s1.movie_id = s2.movie_id
      JOIN actors a1 ON a1.cast_id = s1.cast_id
      JOIN actors a2 ON a2.cast_id = s2.cast_id
    WHERE a1.name <> a2.name AND a1.name = "`+ actor +`"),
  top5_costars AS (SELECT actor, costar, COUNT(*) AS costarred_movies_count
    FROM co_stars
    GROUP BY costar
    ORDER BY costarred_movies_count DESC
    LIMIT 5),
  profit_table AS (SELECT *, (revenue - budget) AS profit 
    FROM movies 
      NATURAL JOIN stars
      NATURAL JOIN actors
    WHERE actors.name = '`+ actor +`'),
  top5_profit AS (SELECT name AS actor, movie_title, profit
    FROM profit_table
    ORDER BY profit DESC
    LIMIT 5),
  cast_table AS (SELECT *, (revenue - budget) AS profit 
    FROM movies 
      NATURAL JOIN stars
      NATURAL JOIN actors
      NATURAL JOIN movie_genre
      NATURAL JOIN genre
    WHERE actors.name = '`+ actor +`'),
  top5_genre AS (SELECT name AS actor, genre, COUNT(*) AS count
    FROM cast_table
    GROUP BY genre
    ORDER BY count DESC
    LIMIT 5), 
  prod AS (SELECT m.movie_id, production_company_id, production_company.name AS prod_co_name, a.cast_id, a.name AS actor_name
    FROM movies m
      NATURAL JOIN made_by
      NATURAL JOIN production_company
      JOIN stars s ON m.movie_id = s.movie_id
      JOIN actors a ON s.cast_id = a.cast_id),
  top5_prod AS (SELECT actor_name AS actor, prod_co_name, COUNT(*) AS prod_co_count
    FROM prod
    WHERE actor_name = '`+ actor +`'
    GROUP BY prod_co_name
    ORDER BY prod_co_count DESC
    LIMIT 5)
  SELECT a.row_num AS _rank,
     costar AS top_costars,
       movie_title AS most_profitable_movies,
       genre AS top_genres, 
       prod_co_name AS top_production_companies
  FROM (SELECT *, ROW_NUMBER() OVER(ORDER BY actor) row_num
    FROM top5_costars) a
  JOIN (SELECT *, ROW_NUMBER() OVER(ORDER BY actor) row_num
    FROM top5_profit) b
      ON a.row_num = b.row_num
  JOIN (SELECT *, ROW_NUMBER() OVER(ORDER BY actor) row_num
    FROM top5_genre) c
      ON a.row_num = c.row_num
  JOIN (SELECT *, ROW_NUMBER() OVER(ORDER BY actor) row_num
    FROM top5_prod) d
      ON a.row_num = d.row_num`;
  
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
}; 

module.exports = {
	getTopMovies: getTopMovies,
  getAssociatedStars: getAssociatedStars,
	getKeywords: getKeywords,
  getRecs: getRecs,
  getDecades: getDecades,
  getGenres: getGenres,
  bestMoviesPerDecadeGenre: bestMoviesPerDecadeGenre,
  getTopFives: getTopFives
};

