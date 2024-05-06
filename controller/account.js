
const sqlite = require('sqlite3').verbose();
const moment = require('moment');

const DB = new sqlite.Database('./database/atm_database.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
})

const AccountCreate = (req, res) => {
    try {
        const { AccountID, ClientID, AccountNumber, AccountType, DateOpened, Balance } = req.body;
        const sql = `INSERT INTO Accounts (AccountID, ClientID, AccountNumber, AccountType, DateOpened, Balance) VALUES (?, ?, ?, ?, ?, ?)`;

        DB.run(sql, [AccountID, ClientID, AccountNumber, AccountType, DateOpened, Balance], (err) => {
            if (err) res.status(400).send({ message: "Error: " + err })
            else res.status(200).send({
                message: 'Create Account endpoint.', data: {
                    AccountID,
                    ClientID,
                    AccountNumber,
                    AccountType,
                    DateOpened,
                    Balance
                }
            });
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const AccountGet = (req, res) => {
    try {
        const sql = `SELECT * FROM Accounts`;

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

const AccountMyAccounts = (req, res) => {
    try {
        const ClientID = req.params['id']
        let sql = `SELECT * FROM Accounts WHERE ClientID = ?`;

        DB.all(sql, [ClientID], (err, rows) => {
            if (err) res.status(400).send({ message: "Accounts Error: " + err })
            else if (rows.length < 1)
                res.status(400).send({ message: "No accounts for this client." })
            else res.status(200).send({ message: "Success", data: rows })
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const AccountWithdraw = (req, res) => {
    try {
        const { AccountID, Amount, ClientID } = req.body
        const date = moment(Date.now()).format("DD-MMM-YY")

        let sql = `UPDATE Accounts SET Balance = Balance - ? WHERE AccountID = ?`
        let sqlTransaction = `INSERT INTO Transactions (AccountID, ClientID, Amount, Date) VALUES (?, ?, ?, ?)`;

        DB.run(sql, [Amount, AccountID], (err, rows) => {
            if (err) res.status(400).send({ message: "The withdrawal was unsuccessful." })
            else {
                DB.run(sqlTransaction, [AccountID, ClientID, -Amount, date], (tran_err, rows) => {
                    if (tran_err) res.status(400).send({ message: "The transaction was not added." })
                    else res.status(200).send({ message: "Success" })
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const AccountTransfer = (req, res) => {
    try {
        const date = moment(Date.now()).format("DD-MMM-YY")
        const { FromAccountID, ToAccountID, ClientID, Amount } = req.body
        let sql = `UPDATE Accounts SET Balance = 
            CASE 
                WHEN AccountID = ? THEN Balance - ?
                WHEN AccountID = ? THEN Balance + ?
            END
            WHERE AccountID IN (?, ?)`;

        let sqlTransaction = `INSERT INTO Transactions (AccountID, ClientID, Amount, Date) VALUES (?, ?, ?, ?), (?, ?, ?, ?)`;


        const values = [FromAccountID, Amount, ToAccountID, Amount, FromAccountID, ToAccountID];

        DB.run(sql, values, (err, rows) => {
            if (err) res.status(400).send({ message: "The transfer was unsuccessful. : " + err })
            else {
                DB.run(sqlTransaction, [FromAccountID, ClientID, -Amount, date, ToAccountID, ClientID, Amount, date], (tran_err, rows1) => {
                    if (tran_err) res.status(400).send({ message: "The transaction was not added." })
                    else res.status(200).send({ message: "Success" })
                })
                res.status(200).send({ message: "Success" })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}

const AccountPayment = (req, res) => {
    try {
        const date = moment(Date.now()).format("DD-MMM-YY")
        const { Name, Surname, AccountNumber, FromAccountID, ClientID, Amount } = req.body
        let sql = `UPDATE Accounts SET Balance = 
            CASE 
                WHEN AccountID = ? THEN Balance - ?
                WHEN AccountNumber = ? THEN Balance + ?
            END
            WHERE AccountID = ? OR AccountNumber = ?`;

        let sqlGetClient = `SELECT ClientID, AccountID FROM Accounts WHERE AccountNumber = ?`
        let sqlTransaction = `INSERT INTO Transactions (AccountID, ClientID, Amount, Date) VALUES (?, ?, ?, ?), (?, ?, ?, ?)`;

        const values = [FromAccountID, Amount, AccountNumber, Amount, FromAccountID, AccountNumber];

        DB.run(sql, values, (err, rows) => {
            if (err) res.status(400).send({ message: "The payment was unsuccessful. : " + err })
            else {
                DB.all(sqlGetClient, [AccountNumber], (cli_err, rows1) => {
                    if (cli_err) res.status(400).send({ message: "Could not find the client." + err })
                    else {
                        DB.run(sqlTransaction, [FromAccountID, ClientID, -Amount, date, rows1[0].AccountID, rows1[0].ClientID, Amount, date], (tran_err, rows2) => {
                            if (tran_err) res.status(400).send({ message: "The transaction was not added." })
                            else res.status(200).send({ message: "Success" })
                        })
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ message: err })
    }
}


module.exports = {
    AccountCreate,
    AccountGet,
    AccountMyAccounts,
    AccountWithdraw,
    AccountTransfer,
    AccountPayment,
}