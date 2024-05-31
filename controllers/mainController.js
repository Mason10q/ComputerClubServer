const mysql = require('mysql');
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

function pathFromFileName(filename) {
    return `/public/images/${filename}`;
}

exports.getAllComputers = (req, res) => {
    let db = getDb();

    let page = req.query.page;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;

    const query = "SELECT * FROM Computers LIMIT ? OFFSET ?"
    console.log("all comps");


    db.connect();

    db.query(query, [limit, offset], (err, rows, fields) => {
        res.status(200).json(rows);
    });

    db.end();
}


exports.searchComputers = (req, res) => {
    let db = getDb();

    let page = req.query.page;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;
    let query = req.query.query;
    let dbQuery = "SELECT * FROM Computers WHERE computer_name LIKE ? LIMIT ? OFFSET ?";

    db.connect();

    db.query(dbQuery, [`%${query}%`, limit, offset], (err, rows, fields) => {
            res.status(200).json(rows);
    });

    db.end();
}


exports.getBasket = (req, res) => {
    let db = getDb();

    let page = req.query.page;
    let limit = Number(req.query.limit);
    let offset = (page - 1) * limit;
    let userId = req.query.userId;
    let query = "SELECT C.* FROM Basket AS B JOIN Computers AS C ON B.computer_id = C.id WHERE B.user_id = ? LIMIT ? OFFSET ?"

    db.connect();


    db.query(query, [userId, limit, offset], (err, rows, fields) => {
        res.status(200).json(rows);
    });

    db.end();
}


exports.addToBasket = (req, res) => {
    let db = getDb();
    let userId = req.query.userId;
    let computerId = req.query.computerId;
    let query = "INSERT INTO Basket (user_id, computer_id) VALUES (?, ?)"


    db.query(query, [userId, computerId], (err, rows, fields) => {
        console.log(err);
        res.status(200).send("Успешно добавлен");
    });

    db.end();
}


exports.removeFromBasket = (req, res) => {
    let db = getDb();
    let userId = req.query.userId;
    let computerId = req.query.computerId;
    let query = "DELETE FROM Basket WHERE user_id = ? AND computer_id = ?"


    db.query(query, [userId, computerId], (err, rows, fields) => {
        res.status(200).send("Успешно удалён");
    });

    db.end();
}

exports.isInBasket = (req, res) => {
    let db = getDb();
    let userId = req.query.userId;
    let computerId = req.query.computerId;
    let query = "SELECT EXISTS (SELECT computer_id FROM Basket WHERE user_id = ? AND computer_id = ?) AS is_in_basket"

    db.query(query, [userId, computerId], (err, rows, fields) => {
        res.status(200).send(rows[0]);
    });

    db.end();
}

