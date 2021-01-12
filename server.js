const express = require('express');

const app = express();

const IP = '0.0.0.0';
const PORT = 55555;

app.use(express.static('pages'));

app.listen(PORT, IP, () => console.log(`Listening on http://${IP}:${PORT}`));