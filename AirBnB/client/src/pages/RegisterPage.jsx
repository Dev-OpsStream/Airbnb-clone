import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function registerUser(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/register', {
                name,
                email,
                password,
            });
            
            setName('');
            setEmail('');
            setPassword('');

            alert('Registration successful');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('User with this email already exists');
            } else {
                alert('Registration failed. Please try again');
            }
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser} autoComplete="off">
                    <input type="text" placeholder="John Doe" 
                        value={name}
                        onChange={ev => setName(ev.target.value)} 
                        autoComplete="new-name"
                        required
                    />
                    <input type="email" placeholder="your@email.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}  
                        autoComplete="new-email"
                        required
                    />
                    <input type="password" placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}  
                        autoComplete="new-password"
                        required
                    />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
