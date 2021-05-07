const config = require('./db-config.js');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- (Dashboard) ---- */

const getTopMovies = (req, res) => {
  var query = `WITH intermediate AS (
    SELECT m.movie_id, m.movie_title as movie, m.overview, m.poster_path as path, m.back_path
    FROM movies m
    WHERE m.vote_count > (SELECT AVG(vote_count) FROM movies)
    ORDER BY m.vote_average DESC, m.movie_title LIMIT 10)
    SELECT t1.movie, t1.overview, t2.genre, t1.path, t1.movie_id, t1.back_path
    FROM (SELECT m.movie, m.overview, m.path, m.movie_id, m.back_path, mg.genre_id FROM intermediate m JOIN movie_genre mg ON mg.movie_id = m.movie_id) AS t1
    JOIN (SELECT g.genre_id, g.genre FROM genre g) AS t2 ON t1.genre_id = t2.genre_id
    GROUP BY t1.movie;
    `;
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
  var query=`WITH tmp AS (SELECT s.cast_id AS cast_id FROM movies m JOIN stars s ON m.movie_id = s.movie_id 
    WHERE m.movie_title = "${movie}")
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
var query = `WITH highest_ranked AS (SELECT movie_id, movie_title, vote_average
  FROM movies ORDER BY vote_average DESC LIMIT 600),
highest_rev AS (SELECT movie_id, movie_title, revenue
FROM movies
ORDER BY revenue DESC LIMIT 600),
movie_keywords AS (SELECT m.movie_id, k.keyword, m.vote_average
  FROM movies m
  NATURAL JOIN about a
  NATURAL JOIN keyword k)
SELECT keyword FROM movie_keywords
WHERE movie_id IN (SELECT movie_id FROM highest_ranked)
ORDER BY vote_average DESC, keyword LIMIT 15;
`;
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
  var query =   `WITH movie_keywords AS (SELECT m.movie_id, m.movie_title, k.keyword
    FROM movies m
    JOIN about ab ON m.movie_id = ab.movie_id
    JOIN keyword k ON ab.keyword_id = k.keyword_id),
rec_movie AS (SELECT m.movie_id, m.poster_path, m.movie_title,
      m.overview, mk.keyword, m.vote_average,
      ABS(Length(mk.keyword) - Length("${keyword}")) As similarity
FROM movies m
JOIN movie_keywords mk ON m.movie_title = mk.movie_title
WHERE mk.keyword = "${keyword}"
OR (((mk.keyword LIKE "% ${keyword} %") OR (mk.keyword LIKE "${keyword} %") OR (mk.keyword LIKE "% ${keyword}")) AND ABS(Length(mk.keyword) - Length("${keyword}")) < 10 AND length("${keyword}") > 2)
OR (((mk.keyword LIKE "% ${keyword} %") OR (mk.keyword LIKE "${keyword} %") OR (mk.keyword LIKE "% ${keyword}")) AND ABS(Length(mk.keyword) - Length("${keyword}")) < 7 AND length("${keyword}") <= 2)),
movie_genres AS (SELECT m.movie_id, m.movie_title as title,
         m.overview, m.vote_average, g.genre
  FROM movies m
  NATURAL JOIN movie_genre
  NATURAL JOIN genre g
  GROUP BY m.movie_id)
SELECT m.movie_id as id, m.poster_path as path, m.movie_title as title,
m.overview, m.vote_average as rating, g.genre, m.keyword
FROM rec_movie m
JOIN movie_genres g ON m.movie_title = g.title
WHERE m.vote_average <= 10
GROUP BY m.movie_title
ORDER BY similarity, m.vote_average DESC, m.movie_title
LIMIT 9;
`;
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

//returns the overviews of the recommended movies
const getOverviews = (req, res) => {
  var movie_id = req.params.movie_id;
  var query = `SELECT overview FROM movies WHERE movie_id = ${movie_id};`;
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

//Returns the actors that have acted in movies with the input keyword, ranked first by
//similarity of the movies' keyword to the input keyword, followed by number of movies with that keyword
const getCastRecs = (req, res) => {
  console.log(500);
  var keyword = req.params.keyword;
  var query =  `WITH movie_keywords AS (SELECT m.movie_id AS movie_id, ab.keyword_id AS keyword_id
                                        FROM movies m
                                        JOIN about ab ON m.movie_id = ab.movie_id),
                     aligned_keywords AS (SELECT mk.movie_id AS movie_id, k.keyword_id AS keyword_id, k.keyword AS keyword,
                                          ABS(Length(k.keyword) - Length("${keyword}")) As similarity
                                          FROM movie_keywords mk
                                          JOIN keyword k ON mk.keyword_id = k.keyword_id
                                          WHERE k.keyword = "${keyword}"
                                          OR (((k.keyword LIKE "% ${keyword} %") OR (k.keyword LIKE "${keyword} %") OR (k.keyword LIKE "% ${keyword}")) AND ABS(Length(k.keyword) - Length("${keyword}")) < 10 AND length("${keyword}") > 2)
                                          OR (((k.keyword LIKE "% ${keyword} %") OR (k.keyword LIKE "${keyword} %") OR (k.keyword LIKE "% ${keyword}")) AND ABS(Length(k.keyword) - Length("${keyword}")) < 7 AND length("${keyword}") <= 2)),
                     selected_movies AS (SELECT m.movie_id, m.movie_title AS title, m.overview AS overview,
                                                ak.keyword AS keyword, ak.similarity FROM movies m
                                         JOIN aligned_keywords ak ON m.movie_id = ak.movie_id)
                SELECT st.cast_id as id, a.name as name, a.profile_path as path,
                       a.gender, sm.keyword, COUNT(sm.movie_id) as count
                FROM selected_movies sm
                JOIN stars st ON st.movie_id = sm.movie_id
                JOIN actors a ON a.cast_id = st.cast_id
                GROUP BY st.cast_id
                ORDER by sm.similarity, COUNT(sm.movie_id) DESC LIMIT 9;`;
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

//returns genres of the movies with the input keyword
const getGenres = (req, res) => {
  var movie_id = req.params.movie_id;
  var query = `WITH intermediate AS (SELECT m.movie_id, m.movie_title as movie,
                                     m.overview, m.vote_average as rating FROM movies m)
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

//returns the genres of movies with the keyword input that a specific actor has acted in
const getCastGenres = (req, res) => {
  var keyword = req.params.keyword;
  var cast_id = req.params.cast_id;
  var query = `WITH movie_keywords AS (SELECT m.movie_id AS movie_id, ab.keyword_id AS keyword_id
                                       FROM movies m
                                       JOIN about ab ON m.movie_id = ab.movie_id),
                    aligned_keywords AS (SELECT mk.movie_id AS movie_id, k.keyword_id AS keyword_id, k.keyword AS keyword
                                         FROM movie_keywords mk
                                         JOIN keyword k ON mk.keyword_id = k.keyword_id
                                         WHERE k.keyword LIKE "%${keyword}%"),
                    actors_movie_keyword AS (SELECT ak.movie_id
                                             FROM aligned_keywords ak
                                             JOIN stars st ON ak.movie_id = st.movie_id
                                             JOIN actors a ON a.cast_id = st.cast_id
                                             WHERE a.cast_id = ${cast_id})
                    SELECT g.genre FROM actors_movie_keyword amk
                    JOIN movie_genre mg ON amk.movie_id = mg.movie_id
                    JOIN genre g ON mg.genre_id = g.genre_id
                    GROUP BY g.genre
                    ORDER BY COUNT(g.genre)
                    DESC LIMIT 4;`;
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/*-- Actors -- */
const getTopFives = (req, res) => {
  var actor = req.params.actor;

  const query = `WITH target AS (SELECT * FROM actors a WHERE a.name = "`+ actor +`"),
  co_stars AS (SELECT s1.cast_id AS actor_id, s2.cast_id AS costar_id, a1.name AS actor, a2.name AS costar
    FROM stars s1
      JOIN stars s2 ON s1.movie_id = s2.movie_id
      JOIN target a1 ON a1.cast_id = s1.cast_id
      JOIN actors a2 ON a2.cast_id = s2.cast_id
    WHERE a1.name <> a2.name),
  top5_costars AS (SELECT actor, costar, COUNT(*) AS costarred_movies_count
    FROM co_stars
    GROUP BY costar
    ORDER BY costarred_movies_count DESC
    LIMIT 5),
  profit_table AS (SELECT *, (revenue - budget) AS profit
    FROM movies
      NATURAL JOIN stars
      NATURAL JOIN target),
  top5_profit AS (SELECT name AS actor, movie_title, profit
    FROM profit_table
    ORDER BY profit DESC
    LIMIT 5),
  cast_table AS (SELECT *, (revenue - budget) AS profit
    FROM movies
      NATURAL JOIN stars
      NATURAL JOIN target
      NATURAL JOIN movie_genre
      NATURAL JOIN genre),
  top5_genre AS (SELECT name AS actor, genre, COUNT(*) AS count
    FROM cast_table
    GROUP BY genre
    ORDER BY count DESC
    LIMIT 5),
  prod AS (SELECT m.movie_id, production_company_id, production_company.name AS prod_co_name, a.cast_id, a.name AS actor_name
    FROM movies m
      NATURAL JOIN made_by
      NATURAL JOIN production_company
      NATURAL JOIN stars s
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


const getTopFiveCompany = (req, res) => {
  var pCompName = req.params.companyName;
  console.log("queryRunning");
  console.log(pCompName);
  const query = `
With table1 as (
With similarity AS (
Select pc.name, ABS(Length(pc.name) - Length("${pCompName}")) As similarity
From production_company pc
WHERE pc.name = "${pCompName}"
   OR (((pc.name LIKE "% ${pCompName} %") OR (pc.name LIKE "${pCompName} %") OR (pc.name LIKE"% ${pCompName}")) AND ABS(Length(pc.name) - Length("$${pCompName}")) < 30 AND length("${pCompName}") > 2)
   OR (((pc.name LIKE "% ${pCompName} %") OR (pc.name LIKE "${pCompName} %") OR (pc.name LIKE "% ${pCompName}")) AND ABS(Length(pc.name) - Length("${pCompName}")) < 7 AND length("${pCompName}") <= 2)
Order by similarity, pc.name
limit 5
) 
Select Distinct pc1.name
 From production_company pc1 JOIN similarity aa ON aa.name = pc1.name JOIN made_by mb ON mb.production_company_id = pc1.production_company_id JOIN movies m1 ON m1.movie_id = mb.movie_id
Group by pc1.name
ORDER BY SUM(m1.revenue) DESC
 LIMIT 1),

 movies_counts As (
Select Count(*) as num
From production_company pc1 JOIN made_by mb1 ON pc1.production_company_id = mb1.production_company_id
JOIN movies m1 ON mb1.movie_id = m1.movie_id , table1
where pc1.name LIKE concat('%',table1.name,'%')
),

95percentile_vote AS (
SELECT vote_count as 95percentile
FROM (SELECT t.*,  @row_num :=@row_num + 1 AS row_num FROM movies t,
    (SELECT @row_num:=0) counter ORDER BY vote_count)
temp WHERE temp.row_num = ROUND (.95* @row_num)
 ),

mean_vote As (
select ceiling(AVG(vote_count)) as mean_vote
from movies
),

TOP5weightedRatedMovies  AS (
Select m1.movie_id, m1.movie_title, (m1.revenue - m1.budget) as profit, ((m1.vote_count * m1.vote_average)/(t1.95percentile + m1.vote_count) + (t1.95percentile * mv1. mean_vote)/(t1.95percentile + m1.vote_count)) as rating
From production_company pc1 JOIN made_by mb1 ON pc1.production_company_id = mb1.production_company_id JOIN movies m1 ON mb1.movie_id = m1.movie_id , 95percentile_vote t1, mean_vote mv1, table1
where pc1.name LIKE concat('%',table1.name,'%') AND m1.revenue - m1.budget > 1000 AND m1.vote_count > t1.95percentile
order by rating desc
limit 5
),

all_movies_details AS (
Select m1.movie_id, m1.movie_title, (m1.budget - m1.revenue) as profit, m1.vote_average, m1.vote_count
From production_company pc1 JOIN made_by mb1 ON pc1.production_company_id = mb1.production_company_id
JOIN movies m1 ON mb1.movie_id = m1.movie_id, table1
where pc1.name LIKE concat('%',table1.name,'%')),


Top5_profitable_movies  AS (
select all_movies_details.movie_title
from all_movies_details
order by all_movies_details.profit Desc
limit 5
),

Top5_rated_movies  AS (
select movie_title
from all_movies_details
order by vote_average DESC
limit 5 ),

TOP5_genre AS (
Select g1.genre, count(*) as count
from all_movies_details m1 JOIN  movie_genre mg1 ON m1.movie_id = mg1.movie_id JOIN genre g1 ON mg1.genre_id = g1.genre_id
Group by g1.genre
Order by count desc
limit 5 ),

TOP5_keyword AS (
Select k1.keyword, count(*) as count
from all_movies_details m1 JOIN  about a1 ON m1.movie_id = a1.movie_id JOIN keyword k1 ON k1.keyword_id = a1.keyword_id
Group by k1.keyword
Order by count desc
limit 5 )

 SELECT a.row_num AS _rank, a.movie_title AS Top5ProfitableMovies,
  b.movie_title AS Top5WeightedRatedMovies, c.movie_title as Top5RatedMovies,
  d.genre as Top5Genres, e.keyword as Top5Keywords, table1.name

from ( SELECT *, ROW_NUMBER() OVER() row_num
    FROM Top5_profitable_movies) a
JOIN (SELECT *, ROW_NUMBER() OVER() row_num
    FROM TOP5weightedRatedMovies) b
ON a.row_num = b.row_num
JOIN (SELECT *, ROW_NUMBER() OVER() row_num
    FROM Top5_rated_movies) c
ON a.row_num = c.row_num
JOIN (SELECT *, ROW_NUMBER() OVER() row_num
    FROM TOP5_genre) d
ON a.row_num = d.row_num
JOIN (SELECT *, ROW_NUMBER() OVER() row_num
    FROM TOP5_keyword) e
ON a.row_num = e.row_num, table1`;

  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

const getPCompany = (req, res) => {
  var pCompName = req.params.pCompName;
  var query = `With table1 as (Select pc.name, ABS(Length(pc.name) - Length("${pCompName}")) As similarity
                               From production_company pc
                               Where pc.name Like "%${pCompName}%"
                               Order by similarity, pc.name limit 10)
              SELECT m1.movie_id as id, pc1.name as companyName, m1.movie_title as title, m1.vote_average as rating,
                     m1.poster_path as path, m1.original_language, m1.overview
              FROM made_by mb1 JOIN production_company pc1 ON pc1.production_company_id = mb1.production_company_id
              JOIN movies m1 ON mb1.movie_id = m1.movie_id,table1
              WHERE pc1.name LIKE CONCAT('%',table1.name,'%')
              ORDER BY Rating DESC LIMIT 9`;
  connection.query(query, function(err, rows, field) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

const getTopPCompanies = (req, res) => {
  var query = `
 Select pc1.name,pc1.production_company_id, SUM(m1.revenue) as total_revenue
From made_by mb1 JOIN movies m1 ON mb1.movie_id = m1.movie_id JOIN production_company pc1 ON mb1.production_company_id = pc1.production_company_id
GROUP BY mb1.production_company_id
ORDER BY SUM(m1.revenue) DESC LIMIT 15;`;
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
  getOverviews: getOverviews,
  getGenres: getGenres,
  getCastRecs: getCastRecs,
  getCastGenres: getCastGenres,
  getTopFiveCompany : getTopFiveCompany,
  getTopFives: getTopFives,
  getPCompany: getPCompany,
  getTopPCompanies : getTopPCompanies,
};
