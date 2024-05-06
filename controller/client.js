
const sqlite = require('sqlite3').verbose();
const DB = new sqlite.Database('./database/atm_database.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
})

const ClientCreate = (req, res) => {
    try {
        const { ClientID, Name, Surname, Password, IDNumber, Email } = req.body;
        const sql = `INSERT INTO Clients (ClientID, Name, Surname, Password, IDNumber, Email) VALUES (?, ?, ?, ?, ?, ?)`;

        DB.run(sql, [ClientID, Name, Surname, Password, IDNumber, Email], (err) => {
            if (err) res.status(400).send({ message: "Error: " + err })
            else res.status(200).send({
                message: 'Create Client endpoint.', data: {
                    ClientID,
                    Name,
                    Surname,
                    Password,
                    IDNumber,
                    Email
                }
            });
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const ClientGet = (req, res) => {
    try {
        let sql = `SELECT * FROM Clients`;
        const { ClientId } = req.query

        if (ClientId) sql += ` WHERE ClientId LIKE '%${ClientId}%'`;

        DB.all(sql, [], (err, rows) => {
            if (err) res.status(400).send({ message: "Error: " + err })
            if (rows.length < 1)
                res.status(400).send({ message: "No data" })
            res.status(200).send({ message: "Success", data: rows })
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const ClientUpdate = (req, res) => {
    try {
        console.log("Update Client")
        res.status(200).send({ message: 'Update Client endpoint called!' })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const ClientSignIn = (req, res) => {
    try {
        const { Email, Password } = req.body;
        let sql = `SELECT * FROM Clients WHERE Email = ? AND Password = ?`;

        DB.all(sql, [Email, Password], (err, rows) => {
            if (err) res.status(400).send({ message: "SignIn Error: " + err })
            else if (rows.length < 1)
                res.status(400).send({ message: "Incorrect login details." })
            else res.status(200).send({ message: "Success", data: rows })
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

module.exports = {
    ClientCreate,
    ClientGet,
    ClientUpdate,
    ClientSignIn
}