import React from 'react'
import { useState } from 'react'
import '../App.css' 

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });
    
            if (response.ok) {
                setMessage('User registered successfully');
            } else {
                setMessage('Failed to register user');
            }
    
            const data = await response.json();
            console.log(data);
        } catch (error) {
            setMessage('An error occurred during registration');
            console.error('Fetch error:', error);
        }
    }
    
    return (
        <form className='register' onSubmit={handleSubmit}>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button>Register</button>
            {message && <p>{message}</p>} {/* Display message */}
        </form>
    );
}

export default RegisterPage