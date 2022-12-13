require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const movieHandlers = require("./movieHandlers");
const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
    res.send("Welcome to my favourite movie list");
};

// ---

const { validateMovie, validateUser } = require("./validators.js");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

// ---

app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", movieHandlers.getUsers);
app.get("/api/users/:id", movieHandlers.getUser);

// ---

app.use(verifyToken);
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.post("/api/users", hashPassword, movieHandlers.postUser);
app.post(
    "/api/login",
    movieHandlers.getUserByEmailWithPasswordAndPassToNext,
    verifyPassword
);

app.put("/api/users/:id", validateUser, movieHandlers.updateUser);
app.delete("/api/users/:id", movieHandlers.deleteUser);

// ---

app.listen(port, (err) => {
    if (err) {
        console.error("Something bad happened");
    } else {
        console.log(`Server is listening on ${port}`);
    }
});
