const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require("mysql");
const url = require('url');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8888;

const app = express();
const REQUEST_ROOT = "/API/v1/";

const CREATE_CODE = 201;
const SUCCESS_CODE = 200;
const UNAUTH_CODE = 401;
const NOT_FOUND_CODE = 404;
const INVALID_CODE = 400;

const CREATE_MESSAGE = "successfully created resource";
const UPDATE_MESSAGE = "successfully updated resource";
const DELETE_MESSAGE = "successfully deleted resource";
const API_ERROR_MESSAGE = "API Key Error";
const NOT_FOUND_MESSAGE = "Requested resource does not exist";
const INVALID_MESSAGE = "Invalid ID";

class HTTPError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
 
const connection = mysql.createConnection({
    host: "45.79.138.240",
    user: "rachella_imdb",
    password: "",
    database: "rachella_imdb",
    multipleStatements: true
});

connection.promise = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if(err) {reject(new Error());}
            else{resolve(result);}
        })
    })
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
    next();
});

// app.post(REQUEST_ROOT + "register", async (req, res) => {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     connection.promise(`SELECT * FROM Users WHERE username='${req.body.username}'`).then((result)=> {
//         console.log(result);
//         let sql;
//         if (result.length == 0) {
//             sql = `INSERT INTO Users (username, password) VALUES ('${req.body.username}', '${hashedPassword}')`;
//             return connection.promise(sql);
//         } else {
//             throw "User already exists";
//         }
//     }).then((result) => {
//         res.send(result.message);
//     }).catch((err) => {
//         res.send(err);
//     });
// });

app.post(REQUEST_ROOT + "login", async (req, res) => {
    connection.promise(`SELECT * FROM Users WHERE username='${req.body.username}'`).then((result) => {
        if (result.length === 0) {
            throw new HTTPError(UNAUTH_CODE, false);
        }
        const success = bcrypt.compareSync(req.body.password, result[0].password);
        return success;
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.get(REQUEST_ROOT + "admin", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            let q = "SELECT * FROM `endpointCounts`;";
            return connection.promise(q);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.get(REQUEST_ROOT + "movie", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            let q = "SELECT * FROM `Movie`;";
            let count = "UPDATE `endpointCounts` SET count=count+1 WHERE method='GET' AND endpoint='/movie';";
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.get(REQUEST_ROOT + "show", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            let q = "SELECT * FROM `TVShow`;";
            let count = "UPDATE `endpointCounts` SET count=count+1 WHERE method='GET' AND endpoint='/show';";
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});


app.get(REQUEST_ROOT + "game", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            let q = "SELECT * FROM `Game`;";
            let count = "UPDATE `endpointCounts` SET count=count+1 WHERE method='GET' AND endpoint='/game';";
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});


app.get(REQUEST_ROOT + "movie/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `SELECT * FROM Movie WHERE id=${req.params.id};`;
            let count = "UPDATE `endpointCounts` SET count=count+1 WHERE method='GET' AND endpoint='/movie/{id}';";
            return connection.promise(q + count).then((result) => {
                if (result[0].length === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.get(REQUEST_ROOT + "show/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `SELECT * FROM TVShow WHERE id='${req.params.id}';`;
            let count = "UPDATE `endpointCounts` SET count=count+1 WHERE method='GET' AND endpoint='/show/{id}';";
            return connection.promise(q + count).then((result) => {
                if (result[0].length === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.get(REQUEST_ROOT + "game/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `SELECT * FROM Game WHERE id='${req.params.id}';`;
            let count = "UPDATE `endpointCounts` SET count=count+1 WHERE method='GET' AND endpoint='/game/{id}';";
            return connection.promise(q + count).then((result) => {
                if (result[0].length === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.get(REQUEST_ROOT + "movie/review/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `SELECT * FROM Review WHERE movie_id=${req.params.id};`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/movie/review/{id}';`;
            return connection.promise(q + count).then((result) => {
                if (result[0].length === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.get(REQUEST_ROOT + "game/review/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `SELECT * FROM Review WHERE game_id=${req.params.id};`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/game/review/{id}';`;
            return connection.promise(q + count).then((result) => {
                if (result[0].length === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.get(REQUEST_ROOT + "show/review/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `SELECT * FROM Review WHERE show_id=${req.params.id};`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='GET' AND endpoint='/show/review/{id}';`;
            return connection.promise(q + count).then((result) => {
                if (result[0].length === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(result[0]);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.post(REQUEST_ROOT + "movie", (req, res) => {
    let apiKey = req.query.apiKey;
    console.log(apiKey);
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            let q = `INSERT INTO Movie (title, director, writer, release_date, category, runtime, description) VALUES ('${req.body.title}', '${req.body.director}', '${req.body.writer}', '${req.body.release_date}', '${req.body.category}', '${req.body.runtime}', '${req.body.desc}');`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/movie';`;
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(CREATE_CODE).send(CREATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.post(REQUEST_ROOT + "show", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            let q = `INSERT INTO TVShow (title, director, release_date, description, seasons) VALUES ('${req.body.title}', '${req.body.director}', '${req.body.release_date}', '${req.body.desc}', ${req.body.seasons});`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/show';`;
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(CREATE_CODE).send(CREATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.post(REQUEST_ROOT + "game", (req, res) => {
    let apiKey = req.query.apiKey;
    console.log(apiKey);
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            let q = `INSERT INTO Game (title, creator, release_date, description) VALUES ('${req.body.title}', '${req.body.creator}', '${req.body.release_date}', '${req.body.desc}');`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/game';`;
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(CREATE_CODE).send(CREATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.post(REQUEST_ROOT + "movie/review/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    console.log(apiKey);
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `INSERT INTO Review (user_name, movie_id, rating, review) VALUES ('${req.body.user_name}', '${req.params.id}', '${req.body.rating}', '${req.body.review}');`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/movie/review/{id}';`;
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(CREATE_CODE).send(CREATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.post(REQUEST_ROOT + "show/review/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    console.log(apiKey);
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `INSERT INTO Review (user_name, show_id, rating, review) VALUES ('${req.body.user_name}', '${req.params.id}', '${req.body.rating}', '${req.body.review}');`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/show/review/{id}';`;
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(CREATE_CODE).send(CREATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.post(REQUEST_ROOT + "game/review/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    console.log(apiKey);
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `INSERT INTO Review (user_name, game_id, rating, review) VALUES ('${req.body.user_name}', '${req.params.id}', '${req.body.rating}', '${req.body.review}');`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='POST' AND endpoint='/game/review/{id}';`;
            return connection.promise(q + count);
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(CREATE_CODE).send(CREATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.put(REQUEST_ROOT + "movie/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `UPDATE Movie SET title='${req.body.title}', director='${req.body.director}', writer='${req.body.writer}', release_date='${req.body.release_date}', category='${req.body.category}', runtime='${req.body.runtime}', description='${req.body.desc}' WHERE id='${req.params.id}';`;
            let count = "UPDATE endpointCounts SET count=count+1 WHERE method='PUT' AND endpoint='/movie/{id}';";
            return connection.promise(q + count).then((result) => {
                console.log("RESULT");
                console.log(result);
                if (result[0].affectedRows === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(UPDATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.put(REQUEST_ROOT + "show/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `UPDATE TVShow SET title='${req.body.title}', director='${req.body.director}', seasons=${req.body.seasons}, release_date='${req.body.release_date}', description='${req.body.desc}' WHERE id=${req.params.id};`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='PUT' AND endpoint='/show/{id}';`;
            return connection.promise(q + count).then((result) => {
                if (result[0].affectedRows === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(UPDATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.put(REQUEST_ROOT + "game/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `UPDATE Game SET title='${req.body.title}', creator='${req.body.creator}', description='${req.body.desc}', release_date='${req.body.release_date}' WHERE id=${req.params.id};`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='PUT' AND endpoint='/game/{id}';`;
            return connection.promise(q + count).then((result) => {
                if (result[0].affectedRows === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(UPDATE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.delete(REQUEST_ROOT + "movie/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        console.log("RESULT");
        console.log(result);
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            q = `DELETE FROM Movie WHERE id='${req.params.id}'; DELETE FROM Review WHERE movie_id='${req.params.id}';`;
            count = `UPDATE endpointCounts SET count=count+1 WHERE method='DELETE' AND endpoint='/movie/{id}';`;
            return connection.promise(q + count).then((result) => {
                if (result[1].affectedRows === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(DELETE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.delete(REQUEST_ROOT + "show/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `DELETE FROM Review WHERE show_id='${req.params.id}'; DELETE FROM TVShow WHERE id='${req.params.id}';`;
            let count = `UPDATE endpointCounts SET count=count+1 WHERE method='DELETE' AND endpoint='/show/{id}';`;
            return connection.promise(q + count).then((result) => {
                if (result[1].affectedRows === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(DELETE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.delete(REQUEST_ROOT + "game/:id", (req, res) => {
    let apiKey = req.query.apiKey;
    const check_key = `SELECT * FROM apiKey WHERE api_key='${apiKey}';`;
    connection.promise(check_key).then((result) => {
        console.log("RESULT");
        console.log(result);
        if (result.length > 0) {
            if (!Number.isInteger(parseInt(req.params.id))) {
                throw new HTTPError(INVALID_CODE, INVALID_MESSAGE);
            }
            let q = `DELETE FROM Review WHERE game_id='${req.params.id}'; DELETE FROM Game WHERE id='${req.params.id}';`;
            let count = ` UPDATE endpointCounts SET count=count+1 WHERE method='DELETE' AND endpoint='/game/{id}';`;
            return connection.promise(q + count).then((result) => {
                if (result[1].affectedRows === 0) {
                    throw new HTTPError(NOT_FOUND_CODE, NOT_FOUND_MESSAGE);
                }
                return result;
            });
        } else {
            throw new HTTPError(UNAUTH_CODE, API_ERROR_MESSAGE);
        }
    }).then((result) => {
        res.status(SUCCESS_CODE).send(DELETE_MESSAGE);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

app.listen(PORT, (err) => {
    if(err) throw err;
    console.log("Listening to port", PORT);
});
