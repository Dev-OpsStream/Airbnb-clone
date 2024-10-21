import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get('/places').then(response => {
            setPlaces(response.data);
        });
    }, []);

    return (
        <div className="mt-8 grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {places.length > 0 && places.map((place, index) => {
                return <Link to={`/places/${place._id}`} key={index} className="group block rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                        {place.photos?.[0] && (
                            <img
                                src={'http://localhost:4000/uploads/' + place.photos[0]}
                                alt={place.title}
                                className="rounded-lg aspect-square object-cover w-full h-57 transition-transform duration-300 group-hover:scale-105"
                            />
                        )}
                    </div>
                    <div className="p-2"> { }
                        <h3 className="font-semibold text-sm text-gray-800">{place.address}</h3>
                        <h2 className="text-sm text-gray-900 font-bold mt-1">{place.title}</h2>
                    </div>
                    <div className="p-2 border-t border-gray-200">
                        <span className="font-bold text-sm text-green-600">₹{place.price} <span className="text-gray-500 text-xs">per night</span></span>
                    </div>
                </Link>
            })}
        </div>
    );
}
