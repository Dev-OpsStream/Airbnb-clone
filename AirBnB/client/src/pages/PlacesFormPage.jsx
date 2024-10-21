import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price, setPrice] = useState(100);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });
    }, [id]);

    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4 font-semibold">{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-600 text-sm">{text}</p>
        );
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
            title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
        };
        if (id) {
            await axios.put('/places', { id, ...placeData });
            setRedirect(true);
        } else {
            await axios.post('/places', placeData);
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />;
    }

    return (
        <div className="mt-8 mx-auto p-6 bg-white rounded-lg shadow-md" style={{ width: '90%' }}>
            <AccountNav />
            <form onSubmit={savePlace}>
                {preInput('Title', 'Title for your place. Should be short and catchy, like an advertisement')}
                <input
                    type="text"
                    value={title}
                    onChange={ev => setTitle(ev.target.value)}
                    placeholder="Title, e.g., My Lovely Apartment"
                    className="w-full p-3 border mt-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {preInput('Address', 'Address to this place')}
                <input
                    type="text"
                    value={address}
                    onChange={ev => setAddress(ev.target.value)}
                    placeholder="Address"
                    className="w-full p-3 border mt-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {preInput('Photos', 'More = better')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

                {preInput('Description', 'Description of the place')}
                <textarea
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}
                    placeholder="Description of your place"
                    className="w-full p-3 border mt-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
                />

                {preInput('Perks', 'Select all the perks of your place')}
                <div className="grid mt-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    <Perks selected={perks} onChange={setPerks} />
                </div>

                {preInput('Extra Info', 'House rules, etc')}
                <textarea
                    value={extraInfo}
                    onChange={ev => setExtraInfo(ev.target.value)}
                    placeholder="Extra information (e.g., house rules)"
                    className="w-full p-3 border mt-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32"
                />

                {preInput('Check-in & Check-out Times', 'Add check-in and check-out times. Remember to have some time window for cleaning the room between guests')}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 mb-1">Check-in Time</h3>
                        <input
                            type="text"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)}
                            placeholder="14:00"
                            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 mb-1">Check-out Time</h3>
                        <input
                            type="text"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)}
                            placeholder="11:00"
                            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 mb-1">Max Number of Guests</h3>
                        <input
                            type="number"
                            value={maxGuests}
                            onChange={ev => setMaxGuests(ev.target.value)}
                            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <h3 className="mt-2 mb-1">Price per Night</h3>
                        <input
                            type="number"
                            value={price}
                            onChange={ev => setPrice(ev.target.value)}
                            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="primary mt-4 w-full text-white py-2 rounded-lg transition duration-200"
                >
                    Save Place
                </button>
            </form>
        </div>
    );
}
