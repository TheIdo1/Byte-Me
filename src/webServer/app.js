//main entry point for the Express server.

//Load Environment Variables First!
require('dotenv').config({ path: './config/.env' });

const express = require('express');
const app = express();

// Define the port (defaults to 3000 if not set in the environment variables)
const PORT = process.env.PORT || 3000;

// Global Middlewares
// this middleware parses incoming requests with JSON payloads.
// Without it, req.body will be undefined in our controllers.
app.use(express.json());

// import Routers
const ordersRouter = require('./routes/orders.route');
const restaurantsRouter = require('./routes/restaurants.route');
const usersRouter = require('./routes/users.route');
const tokensRouter = require('./routes/tokens.route');
const searchRouter = require('./routes/search.route');

// mount Routers
app.use('/api/orders', ordersRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/search', searchRouter);



// Fallback 404 Route
// Best practice: A catch-all route for undefined endpoints to return a clean 404 JSON response,
// instead of the default HTML error page.
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start the Server
// Bind and listen for connections on the specified port
app.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
});