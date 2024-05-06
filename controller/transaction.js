
const sqlite = require('sqlite3').verbose();
const DB = new sqlite.Database('./database/atm_database.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
})

const TransactionCreate = (req, res) => {
    try {
        const { TransactionID, AccountID, ClientID, Amount, Date } = req.body;
        const sql = `INSERT INTO Transactions (TransactionID, AccountID, ClientID, Amount, Date) VALUES (?, ?, ?, ?, ?)`;

        DB.run(sql, [TransactionID, AccountID, ClientID, Amount, Date], (err) => {
            if (err) res.status(400).send({ message: "Error: " + err })
            else res.status(200).send({
                message: 'Create Transaction endpoint.', data: {
                    TransactionID,
                    AccountID,
                    ClientID,
                    Amount,
                    Date
                }
            });
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const TransactionGet = (req, res) => {
    try {
        const ClientID = req.params['id']
        const sql = 
        `SELECT Transactions.*, Accounts.AccountID, Accounts.AccountType
        FROM Transactions
        INNER JOIN Accounts ON Transactions.AccountID = Accounts.AccountID
        WHERE Transactions.ClientID = ?`;

        DB.all(sql, [ClientID], (err, rows) => {
            if (err) res.status(400).send({ message: "Error: " + err })
            if (rows.length < 1)
                res.status(400).send({ message: "No transactions" })
            res.status(200).send({ message: "Success", data: rows })
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const TransactionUpdate = (req, res) => {
    try {
        console.log("Update Transaction")
        res.status(200).send({ message: 'Update Transaction endpoint called!' })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}


module.exports = {
    TransactionCreate,
    TransactionGet,
    TransactionUpdate
}