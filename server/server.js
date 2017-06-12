require('../config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('../database/db');
const routes = require('./routes');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

routes(app);

app.listen(port, () => {
  console.log(`started up at port ${port}`);
});
