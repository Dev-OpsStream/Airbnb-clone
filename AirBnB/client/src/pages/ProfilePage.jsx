import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";

export default function AccountPage() {
    const [redirect, setRedirect] = useState(null);
    const { ready, user, setUser } = useContext(UserContext);

    const { subpage = 'profile' } = useParams();

    async function logout() {
        try {
            await axios.post('/logout');
            setRedirect('/');
            setUser(null);
            alert("Logged out successfully");
        } catch (error) {
            console.error("Error logging out:", error);
            alert("Logout failed. Please try again.");
        }
    }

    if (!ready) {
        return <div>Loading...</div>;
    }

    if (ready && !user) {
        return <Navigate to='/login' />;
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }


    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && user && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br />
                    <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    );
}
