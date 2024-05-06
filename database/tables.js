const sqlite = require('sqlite3').verbose();
const DB = new sqlite.Database('./database/atm_database.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
    console.log("Connected to sqlite database.")
})

const clients_table =
    'CREATE TABLE IF NOT EXISTS Clients (' +
    'ClientID INTEGER PRIMARY KEY, ' +
    'Name VARCHAR(50), ' +
    'Surname VARCHAR(50), ' +
    'Password VARCHAR(50), ' +
    'IDNumber VARCHAR(50), ' +
    'Email VARCHAR(100))';

const accounts_table =
    'CREATE TABLE IF NOT EXISTS Accounts (' +
    'AccountID INTEGER PRIMARY KEY, ' +
    'ClientID INTEGER, ' +
    'AccountNumber VARCHAR(50), ' +
    'AccountType VARCHAR(50), ' +
    'DateOpened VARCHAR(50), ' +
    'Balance FLOAT, ' +
    'FOREIGN KEY (ClientID) REFERENCES Clients(ClientID))';


const transactions_table =
    'CREATE TABLE IF NOT EXISTS Transactions (' +
    'TransactionID INTEGER PRIMARY KEY, ' +
    'AccountID INTEGER, ' +
    'ClientID INTEGER, ' +
    'Amount FLOAT, ' +
    'Date VARCHAR(50), ' +
    'FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID), '+ 
    'FOREIGN KEY (ClientID) REFERENCES Clients(ClientID)) ';


DB.run(clients_table)
DB.run(accounts_table)
DB.run(transactions_table)