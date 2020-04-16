const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.static('public'));

app.listen(3000, () => console.log('Connected to port 3000'));
