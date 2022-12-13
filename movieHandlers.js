const database = require("./database");

const getMovies = (req, res) => {
    let initialSql = "select * from movies";
    const sqlValues = [];

    if (req.query.color != null) {
        sqlValues.push({
            column: "color",
            value: req.query.color,
            operator: "=",
        });
    }
    if (req.query.max_duration != null) {
        sqlValues.push({
            column: "duration",
            value: req.query.max_duration,
            operator: "<=",
        });
    }

    database
        .query(
            sqlValues.reduce(
                (sql, { column, operator }, index) =>
                    `${sql} ${
                        index === 0 ? "where" : "and"
                    } ${column} ${operator} ?`,
                initialSql
            ),
            sqlValues.map(({ value }) => value)
        )
        .then(([movies]) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

const getMovieById = (req, res) => {
    const id = parseInt(req.params.id);
    database
        .query("select * from movies where id = ?", [id])
        .then(([movies]) => {
            if (movies[0] != null) {
                res.json(movies[0]);
            } else {
                res.status(404).send("Not Found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

const getUsers = (req, res) => {
    let initialSql =
        "SELECT id, firstname, lastname, email, city, language from users";
    const sqlValues = [];

    if (req.query.language != null) {
        sqlValues.push({
            column: "language",
            value: req.query.language,
            operator: "=",
        });
    }
    if (req.query.city != null) {
        sqlValues.push({
            column: "city",
            value: req.query.city,
            operator: "=",
        });
    }

    database
        .query(
            sqlValues.reduce(
                (sql, { column, operator }, index) =>
                    `${sql} ${
                        index === 0 ? "where" : "and"
                    } ${column} ${operator} ?`,
                initialSql
            ),
            sqlValues.map(({ value }) => value)
        )
        .then(([movies]) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

const getUser = (req, res) => {
    const id = parseInt(req.params.id);
    database
        .query(
            "SELECT firstname, lastname, email, city, language from users where id = ?",
            [id]
        )
        .then(([users]) => {
            if (users[0] != null) {
                res.json(users[0]);
            } else {
                res.status(404).send("Not Found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const { email } = req.body;
    database
        .query("SELECT * from users where email = ?", [email])
        .then(([users]) => {
            if (users[0] != null) {
                req.user = users[0];
                next();
            } else {
                res.status(401);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
};

// ---

const postMovie = (req, res) => {
    const { title, director, year, color, duration } = req.body;

    database
        .query(
            "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
            [title, director, year, color, duration]
        )
        .then(([result]) => {
            res.location(`/api/movies${result.insertId}`).sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the movie");
        });
};

const postUser = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } =
        req.body;

    database
        .query(
            "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language, hashedPassword]
        )
        .then(([result]) => {
            res.location(`/api/users${result.insertId}`).sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the user");
        });
};

// ---

const updateMovie = (req, res) => {
    const id = parseInt(req.params.id);
    const { title, director, year, color, duration } = req.body;

    database
        .query(
            "update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
            [title, director, year, color, duration, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing the movie");
        });
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language } = req.body;

    database
        .query(
            "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
            [firstname, lastname, email, city, language, id]
        )
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error editing the user");
        });
};

// ---

const deleteMovie = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("DELETE FROM movies WHERE id=?", [id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting the movie");
        });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("DELETE FROM users WHERE id=?", [id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error deleting the movie");
        });
};

// ---

module.exports = {
    getMovies,
    getMovieById,
    getUsers,
    getUser,
    getUserByEmailWithPasswordAndPassToNext,

    postMovie,
    postUser,

    updateMovie,
    updateUser,

    deleteMovie,
    deleteUser,
};
