import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);

    useEffect(() => {
        if (!id) return;

        axios.get(`/places/${id}`).then((response) => {
            setPlace(response.data);
        });
    }, [id]);

    if (!place) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="bg-gray-100 rounded p-3 mt-4 w-[90%] mx-auto">
            <h1 className="text-2xl font-bold md:mt-0 mb-4">{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>
            <PlaceGallery place={place} />
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                <div className="flex-col">
                    <div className="my-4">
                        <h2 className="font-semibold text-2xl">Description</h2>
                        {place.description}
                    </div>
                    <div className="border-t py-2">
                        Check-in: {place.checkIn}<br />
                        Check-out: {place.checkOut}<br />
                        Max number of guests: {place.maxGuests}
                    </div>
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="bg-bray-200 -mx-8 px-8 py-8 border-t">
                <div>
                    <h2 className="font-semibold text-2xl">Extra info</h2>
                </div>
                <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
            </div>
        </div>
    );
}
