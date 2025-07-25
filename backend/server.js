// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// const routes = require('./routes/routes.js');
// const authroutes = require('./routes/authRoutes.js');

// app.use('/api', routes);
// app.use('/api', authroutes);

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Enables parsing of JSON bodies

// Routes
const generalRoutes = require('./routes/routes.js');       // Optional - for other APIs
const authRoutes = require('./routes/authRoutes.js');       // Handles login, token, etc.

app.use('/api', generalRoutes);  // e.g., /api/some-endpoint (Optional)
app.use('/api', authRoutes);     // e.g., /api/login

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
