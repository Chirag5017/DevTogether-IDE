const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Express.js Server!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
