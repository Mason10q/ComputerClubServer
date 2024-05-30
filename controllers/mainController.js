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