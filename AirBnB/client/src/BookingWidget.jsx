import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from 'date-fns';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) { 
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [redirect, setRedirect] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookThisPlace() {
        const response = await axios.post('/bookings', {
            place: place._id,
            checkIn,
            checkOut,
            maxGuests,
            name,
            mobile,
            price: numberOfNights * parseFloat(place.price)
        });
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div className="bg-white shadow-lg p-4 rounded-2xl max-w-md mx-auto">
            <div className="text-2xl text-center mb-4">
                Price: ₹{place.price}/ per night
            </div>
            <div className="border rounded-2xl">
                <div className="flex flex-col md:flex-row">
                    <div className="py-2 px-4 flex-1">
                        <label className="block">Check in:</label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={ev => setCheckIn(ev.target.value)} 
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="py-2 px-4 flex-1 border-t md:border-t-0 md:border-l">
                        <label className="block">Check out:</label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={ev => setCheckOut(ev.target.value)}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                <div>
                    <div className="py-2 px-4 border-t text-center">
                        <label className="block">Number of guests:</label>
                        <input
                            type="number"
                            value={maxGuests}
                            onChange={ev => setMaxGuests(ev.target.value)} 
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    {numberOfNights > 0 && (
                        <div className="py-2 px-4">
                            <label className="block">Your full name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={ev => setName(ev.target.value)} 
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                            <label className="block mt-2">Phone number:</label>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={ev => {
                                    const value = ev.target.value;
                                    if (/^\d{0,10}$/.test(value)) {
                                        setMobile(value);
                                    }
                                }}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                        </div>
                    )}
                </div>
            </div>
            <button onClick={bookThisPlace} className="primary mt-4 w-full">
                Book this place&nbsp;
                {numberOfNights > 0 && (
                    <span>
                        ₹{numberOfNights * parseFloat(place.price)}
                    </span>
                )}
            </button>
        </div>
    );
}
