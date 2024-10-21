import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/login', { email, password });
            const { name, email: userEmail, _id } = response.data; 
            setUser({ name, email: userEmail, _id }); 
            alert("Login Successful");

            setEmail('');
            setPassword('');

            setRedirect(true);
        } catch (e) {
            if (e.response) {
                if (e.response.status === 422) {
                    alert("Incorrect password");
                } else if (e.response.status === 404) {
                    alert("User not found");
                } else {
                    alert("Login failed, please try again");
                }
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-32">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit} autoComplete="off">
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                        required
                        autoComplete="new-email"
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <button type="submit" className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
