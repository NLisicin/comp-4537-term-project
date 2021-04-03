const express = require('express');
const mysql = require("mysql");
const PORT = process.env.PORT || 8888;
const app = express();
const REQUEST_ROOT = "/API/v1/";

const connection = mysql.createConnection({
    host: "localhost",
    user: "rachella_imdb",
    password: "COMP4537",
    database: "rachella_imdb",
    multipleStatements: true
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
    next();
});

app.get(REQUEST_ROOT + "admin", (req, res) => {
    connection.query("SELECT * FROM endpointCounts;", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get(REQUEST_ROOT + "movie", (req, res) => {
    let q = `SELECT * FROM Movie;`;
    let count = `UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/movie';`;
    connection.query(q + count, (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

app.get(REQUEST_ROOT + "show", (req, res) => {
    connection.query("SELECT * FROM Show; UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/show';", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get(REQUEST_ROOT + "game", (req, res) => {
    connection.query("SELECT * FROM Game; UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/game';", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get(REQUEST_ROOT + "movie/:id", (req, res) => {
    connection.query(`SELECT * FROM Movie WHERE id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/movie/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

app.get(REQUEST_ROOT + "show/:id", (req, res) => {
    connection.query(`SELECT * FROM Show WHERE id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/show/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get(REQUEST_ROOT + "game/:id", (req, res) => {
    connection.query(`SELECT * FROM Game WHERE id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/game/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get(REQUEST_ROOT + "movie/review/:id", (req, res) => {
    connection.query(`SELECT * FROM Review WHERE movie_id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/movie/review/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get(REQUEST_ROOT + "game/review/:id", (req, res) => {
    connection.query(`SELECT * FROM Review WHERE game_id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/game/review/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get(REQUEST_ROOT + "show/review/:id", (req, res) => {
    connection.query(`SELECT * FROM Review WHERE show_id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/show/review/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post(REQUEST_ROOT + "movie", (req, res) => {
    let q = `INSERT INTO Movie (title, director, release_date, description) VALUES (${req.body.title}, ${req.body.director}, ${req.body.writer}, ${req.body.release_date}, ${req.body.category}, ${req.body.runtime}, ${req.body.desc});`;
    let count = `UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/movie';`;
    
    connection.query(q + count, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post(REQUEST_ROOT + "show", (req, res) => {
    connection.query(`INSERT INTO Show (title, director, release_date, description, seasons) VALUES (${req.body.title}, ${req.body.director}, ${req.body.release_date}, ${req.body.desc}, ${req.seasons}); UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/show';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post(REQUEST_ROOT + "game", (req, res) => {
    connection.query(`INSERT INTO Game (title, creator, release_date, description) VALUES (${req.body.title}, ${req.body.creator}, ${req.body.release_date}, ${req.body.desc}); UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/game';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post(REQUEST_ROOT + "movie/review/:id", (req, res) => {
    connection.query(`INSERT INTO Review (movie_id, rating, review) VALUES (${req.params.id}, ${req.body.rating}, ${req.body.review}); UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/movie/review/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post(REQUEST_ROOT + "show/review/:id", (req, res) => {
    connection.query(`INSERT INTO Review (show_id, rating, review) VALUES (${req.params.id}, ${req.body.rating}, ${req.body.review}); UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/show/review/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post(REQUEST_ROOT + "game/review/:id", (req, res) => {
    connection.query(`INSERT INTO Review (game_id, rating, review) VALUES (${req.params.id}, ${req.body.rating}, ${req.body.review}); UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/game/review/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.put(REQUEST_ROOT + "movie/:id", (req, res) => {
    connection.query(`UPDATE Movie SET (title, director, writer, release_date, category, runtime, description) VALUES (${req.body.title}, ${req.body.director}, ${req.body.writer}, ${req.body.release_date}, ${req.body.category}, ${req.body.runtime}, ${req.body.desc}) WHERE id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='PUT' AND endpoint='/movie/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.put(REQUEST_ROOT + "show/:id", (req, res) => {
    connection.query(`UPDATE Show SET (title, director, seasons, release_date, description) VALUES (${req.body.title}, ${req.body.director}, ${req.body.seasons}, ${req.body.release_date}, ${req.body.desc}) WHERE id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='PUT' AND endpoint='/show/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.put(REQUEST_ROOT + "game:id", (req, res) => {
    connection.query(`UPDATE Game SET (name, creator, description, release_date) VALUES (${req.body.name}, ${req.body.creator}, ${req.body.desc}, ${req.body.release_date} WHERE id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='PUT' AND endpoint='/game/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.put(REQUEST_ROOT + "review/:id", (req, res) => {
    connection.query(`UPDATE Review SET (rating, review) VALUES (${req.body.rating}, ${req.body.review}) WHERE id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='PUT' AND endpoint='/review/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.delete(REQUEST_ROOT + "movie/:id", (req, res) => {
    connection.query(`DELETE FROM Movie WHERE id=${req.params.id}; DELETE FROM Review WHERE movie_id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='DELETE' AND endpoint='/movie/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.delete(REQUEST_ROOT + "show/:id", (req, res) => {
    connection.query(`DELETE FROM Show WHERE id=${req.params.id}; DELETE FROM Review WHERE show_id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='DELETE' AND endpoint='/show/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.delete(REQUEST_ROOT + "game/:id", (req, res) => {
    connection.query(`DELETE FROM Game WHERE id=${req.params.id}; DELETE FROM Review WHERE game_id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='DELETE' AND endpoint='/game/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.delete(REQUEST_ROOT + "review/:id", (req, res) => {
    connection.query(`DELETE FROM Game WHERE id=${req.params.id}; UPDATE endpointCounts SET count=count+1 WHERE method='DELETE' AND endpoint='/review/{id}';`, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


app.listen(PORT, (err) => {
    if(err) throw err;
    console.log("Listening to port", PORT);
});