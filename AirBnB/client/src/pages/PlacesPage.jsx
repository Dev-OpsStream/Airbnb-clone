import { Link } from "react-router-dom";
import AccountNav from "./AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";

export default function PlacesPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/user-places')
            .then(({ data }) => {
                setPlaces(data);
            })
            .catch((error) => {
                console.error('Error fetching places:', error);
            });
    }, []);

    // Function to delete a place
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this place?");
        if (!confirmDelete) return; // Exit if the user cancels

        try {
            await axios.delete(`/places/${id}`);
            setPlaces(places.filter(place => place._id !== id)); // Update the state to remove the deleted place
            alert("Place deleted successfully");
        } catch (error) {
            console.error('Error deleting place:', error);
            alert("Error deleting place");
        }
    };

    return (
        <div className="p-6">
            <AccountNav />
            <div className="text-center mb-6">
                <Link
                    className="inline-flex justify-center items-center gap-1 bg-primary text-white py-2 px-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
                    to='/account/places/new'
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new place
                </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {places.length > 0 ? (
                    places.map((place) => (
                        <div
                            key={place._id}
                            className="relative flex flex-col gap-4 bg-white shadow-md hover:shadow-lg p-4 rounded-2xl cursor-pointer transition-shadow duration-300"
                        >
                            <Link to={'/account/places/' + place._id} className="flex-grow flex flex-col gap-4">
                                <div className="w-full h-34 overflow-hidden rounded-lg border border-gray-300 flex-shrink-0">
                                    <PlaceImg place={place} />
                                </div>
                                <div className="flex-grow">
                                    <h2 className="text-xl font-semibold text-gray-800">{place.title}</h2>
                                    <p className="text-sm text-gray-600 mt-1">{place.description}</p>
                                </div>
                            </Link>
                            <button
                                onClick={() => handleDelete(place._id)}
                                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-colors duration-600"
                                aria-label="Delete place"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-600">
                        <p>No places found. Please add some!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
