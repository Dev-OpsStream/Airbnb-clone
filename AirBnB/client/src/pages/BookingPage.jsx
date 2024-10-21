import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceGallery from "../PlaceGallery";

export default function BookingPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({ _id }) => _id === id);
                if (foundBooking) {
                    setBooking(foundBooking);
                }
            });
        }
    }, [id]);

    if (!booking) {
        return <p>Loading booking details...</p>;
    }

    return (
        <div className="my-8 mx-auto max-w-5xl">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Image Section */}
                <div className="sm:flex">
                    <div className="sm:w-1/2 h-64 sm:h-auto bg-gray-200 flex justify-center items-center">
                        <PlaceGallery place={booking.place} />
                    </div>

                    {/* Booking Information Section */}
                    <div className="sm:w-1/2 p-6 bg-white flex flex-col justify-between">
                        <h1 className="text-2xl font-bold mb-4">{booking.place.title}</h1>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                            <h2 className="text-lg font-semibold mb-4">Booking Information</h2>
                            <div className="text-sm space-y-2">
                                <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                                <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                                <p><strong>Guests:</strong> {booking.maxGuests}</p>
                                <p><strong>Booked By:</strong> {booking.name}</p>
                                <p><strong>Mobile:</strong> {booking.mobile}</p>
                                <p><strong>Email:</strong> {booking.email || "Not provided"}</p>
                                <p><strong>Special Requests:</strong> {booking.specialRequests || "None"}</p>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-primary text-white p-4 text-center rounded-lg shadow-md">
                            <div className="text-lg font-semibold">Total Price</div>
                            <div className="text-3xl font-bold">₹{booking.price}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
