const argon2 = require("argon2");

const hashOptions = {
    type: argon2.argon2id, // variant of the hash function
    memoryCost: 2 ** 16, // amount of memory to be used by the hash function
    timeCost: 2, // nb iteration
    parallelism: 4, // amount of threads to compute the hash on
};

const hashPassword = (req, res, next) => {
    argon2
        .hash(req.body.password, hashOptions)
        .then((hashedPassword) => {
            console.log(hashedPassword);

            req.body.hashedPassword = hashedPassword;
            delete req.body.password;

            next();
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

module.exports = {
    hashPassword,
};
