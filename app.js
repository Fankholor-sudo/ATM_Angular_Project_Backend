const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, Svc-Tkn'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE');

	next();
});
//________________________________________________________________

const account = require('./routes/account');
const client = require('./routes/client');
const transaction = require('./routes/transaction');

//______________Routes
app.use('/account', account)
app.use('/client', client)
app.use('/transaction', transaction)
app.get('/test', (req, res) => {
    res.status(200).json({ message: "The test endpoint is working." })
})

app.all('*', (req, res) => {
	res.status(404).json({ message: 'Resource not found' });
});

const PORT = 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));