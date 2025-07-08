const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const routes = require('./routes/routes.js');
const authroutes = require('./routes/authRoutes.js');

app.use('/api', routes);
app.use('/api', authroutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
