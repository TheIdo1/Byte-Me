const net = require('net');

// Load Environment Variables First!
require('dotenv').config({ path: '../config/.env' });

// Corrected the environment variable mappings
const CPP_PORT = process.env.CPP_SERVER_PORT || 8081; 
const CPP_HOST = process.env.CPP_SERVER_IP || '127.0.0.1';

const sendCommandToCpp = (payload) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let responseData = '';

        client.connect(CPP_PORT, CPP_HOST, () => {
            // Check if it's already a string so we don't accidentally wrap it in quotes
            const messageStr = typeof payload === 'string' 
                ? payload + '\n' 
                : JSON.stringify(payload) + '\n';
                
            client.write(messageStr);
        });

        client.on('data', (data) => {
            responseData += data.toString();
            client.destroy(); 
        });

        client.on('close', () => {
            try {
                const parsedResponse = responseData ? JSON.parse(responseData) : null;
                resolve(parsedResponse);
            } catch (err) {
                resolve(responseData.trim()); // Trim removes trailing newlines
            }
        });

        client.on('error', (err) => {
            console.error(`Socket Error: ${err.message}`);
            reject(new Error('Failed to communicate with the core engine.'));
        });
        
        client.setTimeout(5000); 
        client.on('timeout', () => {
            client.destroy();
            reject(new Error('Connection to C++ server timed out.'));
        });
    });
};

module.exports = {
    sendCommandToCpp
};