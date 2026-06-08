import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// We import the tokenAPI function
import { login } from '../api/authApi';

// the style for our page
import './LoginPage.css';

//TODO- THINK ABOUT A WAY TO REDIRECT A ALREADY LOGGED IN USER SO HE WONT SEE THIS SCREEN

// LoginPage Component
// This component renders the login screen. It collects the user's credentials
// and sends them to the backend using our shared API functions.
export default function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // useNavigate is a tool provided by React Router
    // It allows us to change the URL (redirect the user) via code without reloading the page
    const navigate = useNavigate();

    
    // handleSubmit
    // This function runs when the user clicks the Login button or presses Enter
    const handleSubmit = async (e) => {
        // In standard HTML, submitting a form refreshes the entire page
        // We use preventDefault() to stop that, so React can handle it smoothly in the background
        e.preventDefault(); 
        
        // Reset the error state and turn on the loading indicator
        setError('');
        setLoading(true);

        try {
            // Call the team's API function. 
            // The await keyword pauses the code here until the server responds.
            const data = await login(username, password);
            
            // check f the server successfully returns a token
            if (data && data.token) {
                // if theres a token we save it in the browser's localStorage. 
                // This acts as our "session pass" for future API requests.
                localStorage.setItem('token', data.token);
                
                // Redirect the user to the home page ('/')
                navigate('/');
            } else {
                setError('Login succeeded but no token was returned from the server.');
            }

        } catch (err) {
            // If the server returns an error (like 401 Unauthorized), we catch it and display it.
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            // This block runs no matter what happens (success or failure).
            // We turn off the loading indicator so the user can interact with the form again.
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="page">
                {/* Custom styled branding headers */}
                <h1 className="logo-text">Byte Me</h1>
                <h2 className="subtitle-text">Login to Byte-Me</h2>
                
                {
                    // CONDITIONAL RENDERING: 
                    // The code inside the { } says: "If 'error' has text in it, render this <p> tag. 
                    // Otherwise, render nothing."
                }
                {error && <div className="error-message">{error}</div>}
                
                {/* The onSubmit event is connected to our handleSubmit function above */}
                <form onSubmit={handleSubmit}>
                    {/* Username Input Group */}
                    <div className="input-group">
                        <label htmlFor="username" className="input-label">Username</label>
                        <input 
                            type="text" 
                            id="username"
                            name="username"
                            className="wolt-input"
                            value={username}
                            // onChange runs every time a single character is typed or deleted.
                            // e.target.value is whatever text is currently inside the input box.
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    {/* Password Input Group */}
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            className="wolt-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    {
                        // if 'loading' is true, we disable the button so the user can't click it twice,
                        // and we change the text to show them something is happening.
                    }
                    <button type="submit" className="wolt-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}