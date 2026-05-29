// middleware to validate and sanitize the search query parameter
// ensures the query is not empty, meets length requirements, and does not contain illegal HTML characters


const validateSearchQuery = (req, res, next) => {
    let query = req.params.query;

    //check if the parameter exists and is not just empty spaces
    if (!query || query.trim().length === 0) {
        return res.status(400).json({ error: "Search query cannot be empty." });
    }

    // Remove leading and trailing white spaces
    query = query.trim();


    // Maximum length validation (DoS prevention)
    // we restrict the maximum length to ensure our server
    // isn't blocked by heavy, time-consuming string matching operations on massive inputs
    if (query.length > 50) {
        return res.status(400).json({ error: "Search query is too long (maximum 50 characters)." });
    }

    //Sanitization - prevent basic XSS attacks by blocking HTML tags
    //blocking characters like < and > prevents attackers from injecting 
    // malicious HTML or javascript that could be executed if the client renders the query
    const forbiddenChars = /[<>]/;
    if (forbiddenChars.test(query)) {
        return res.status(400).json({ error: "Search query contains invalid characters." });
    }

    // Store the sanitized, lowercase query on the request object for the controller to use
    req.cleanQuery = query.toLowerCase();

    // Pass control to the next middleware or controller
    next();
};

module.exports = { validateSearchQuery };