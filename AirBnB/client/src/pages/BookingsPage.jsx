import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "./AccountNav";
import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import PlaceImg from "../PlaceImg";

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/bookings')
            .then(response => {
                setBookings(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (bookingId) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                await axios.delete(`/bookings/${bookingId}`);
                setBookings(bookings.filter(booking => booking._id !== bookingId)); 
            } catch (error) {
                console.error('Error deleting booking:', error);
            }
        }
    };

    if (loading) {
        return <p>Loading bookings...</p>;
    }

    return (
        <div>
            <AccountNav />
            <div className="mx-4 sm:mx-8 flex flex-wrap justify-between">
                {bookings?.length > 0 ? (
                    bookings.map(booking => (
                        <div key={booking._id} className="relative flex mb-4 border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 w-full sm:w-[calc(50%-16px)]" style={{ minHeight: '250px' }}>
                            <Link to={`/account/bookings/${booking._id}`} className="flex flex-col sm:flex-row flex-1">
                                <div className="w-full sm:w-48 h-full">
                                    <PlaceImg place={booking.place} />
                                </div>
                                <div className="ml-0 sm:ml-4 flex-1 flex flex-col justify-between h-full">
                                    <div className="text-sm text-gray-500">
                                        <h2 className="text-xl text-gray-800">{booking.place.title}</h2>
                                        <div className="flex flex-col sm:flex-row gap-2 mt-2 border-t pt-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1 -mt-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                                                </svg>
                                                Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1 -mt-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                                                </svg>
                                                Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1 -mt-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25v-11A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v11c0 1.241 1.01 2.25 2.25 2.25Z" />
                                                </svg>
                                                {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} Nights
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-semibold mt-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25v-11A2.25 2.25 0 0 0 17.25 6H6.75A2.25 2.25 0 0 0 4.5 8.25v11c0 1.241 1.01 2.25 2.25 2.25Z" />
                                        </svg>
                                        <div className="text-gray-600 font-bold text-sm text-green-600">₹{booking.price}</div>
                                    </div>
                                </div>
                            </Link>
                            <button onClick={() => handleDelete(booking._id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors duration-200 rounded-2xl m-2 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No bookings found.</p>
                )}
            </div>
        </div>
    );
}
