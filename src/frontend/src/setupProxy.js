// CRA development proxy. Forwards /api requests to the web server so the
// browser never needs to know the backend address.
// REACT_APP_API_URL is set to http://web-server:8081 inside Docker;
// falls back to localhost:8081 for local development.
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:8081',
      changeOrigin: true,
    })
  );
};
