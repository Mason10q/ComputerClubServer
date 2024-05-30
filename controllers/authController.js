const mysql = require('mysql');
const crypto = require('node:crypto');
const dotenv = require('dotenv');

function getConfig() {
    return dotenv.config({path: __approot + '/.env'});
}

function getDb() {
    let config = getConfig();
    return mysql.createConnection({
        host: config.parsed.DB_HOST,
        user: config.parsed.DB_USER,
        database: config.parsed.DB_NAME,
        password: config.parsed.DB_PASS
    });
}

function hashPassword(password, callback) {
    let config = getConfig().parsed;
    crypto.pbkdf2(password, config.SALT, Number(config.ITERATIONS), 64, config.METHOD, function(ee, derivedKey){
        callback(derivedKey.toString('hex'));
    });
}

function isPasswordCorrect(savedHash, passwordAttempt, callback) {
    let config = getConfig().parsed;
    crypto.pbkdf2(passwordAttempt, config.SALT, Number(config.ITERATIONS), 64, config.METHOD, function(ee, derivedKey){
        callback(derivedKey.toString('hex') == savedHash);
    });
}


exports.signUp = (req, res) => {
    let db = getDb();
    const { name, email, birthDate, password } = req.body

    console.log(req.body);

    db.connect();

    hashPassword(password, (hash) => {
        let signup_query = "INSERT INTO Users SET? RETURNING id";
        let check_email_query = "SELECT * FROM Users WHERE user_email = ?"

        db.query(check_email_query, [email], (err, rows, fields) => {
            console.log(err);
            if(rows != undefined && rows.length != 0){
                res.status(401).send("Такая почта уже зарегестрирована");
                return;
            }
        });

        db.query(signup_query, {user_name: name, user_email: email, user_birth: birthDate, password_hash: hash}, (err, rows, fields)=>{
            if(err != undefined) return;
            res.status(200).json(rows[0]);
        });
        
        db.end();
    });
}


exports.signIn = (req, res) => {
    let db = getDb();
    let email = req.body.email;
    let password = req.body.password;

    db.connect();

    let query = "SELECT id, password_hash \
                    FROM Users \
                    WHERE user_email = ? \
                    LIMIT 1";

    db.query(query, [email], (err, rows, fields) => {
        
        if(rows === undefined || rows.length === 0){
            res.status(401).send("Такая почта не зарегестрирована");
            return;
        }

        isPasswordCorrect(rows[0].password_hash, password, (isCorrect) => {
            if(isCorrect){
                console.log(rows[0]);
                res.status(200).json(rows[0]);
            } else{
                res.status(402).send("Неверный пароль");
            }
        });
    });

    db.end();
}


exports.deleteProfile = (req, res) => {
    let db = getDb();
    let user_id = req.query.user_id;
    let query = "DELETE FROM Users WHERE id = ?";

    db.connect();

    db.query(query, [user_id], (err, rows, fields) => {
        res.send();
    });

    db.end();
}