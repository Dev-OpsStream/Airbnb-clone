import { useState } from "react";

export default function PlaceGallery({ place }) {
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-white p-8 overflow-auto" style={{ height: '150vh', width: '100%' }}>
                <h1 className="text-2xl font-bold mb-4">Photos of {place.title}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {place?.photos?.length > 0 && place.photos.map((photo, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden shadow-md p-1 bg-gray-100">
                            <img
                                className="w-full h-auto object-cover rounded-md transition-opacity duration-300 hover:opacity-85"
                                src={'http://localhost:4000/uploads/' + photo}
                                alt={`Photo ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setShowAllPhotos(false)}
                    className="fixed top-7 right-4 bg-white text-black py-2 px-4 flex items-center rounded-lg shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                    </svg>
                    Close photos
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr] mt-4 rounded-3xl overflow-hidden">
                <div className="border border-gray-300 overflow-hidden">
                    {place.photos?.[0] && (
                        <img
                            onClick={() => setShowAllPhotos(true)}
                            className="cursor-pointer w-full object-cover transition-transform duration-300 hover:scale-105"
                            style={{ height: '50vh' }}
                            src={`http://localhost:4000/uploads/${place.photos[0]}`}
                            alt="Main Photo"
                        />
                    )}
                </div>
                <div className="grid gap-2">
                    {place.photos?.[1] && (
                        <div className="border border-gray-300 overflow-hidden">
                            <img
                                onClick={() => setShowAllPhotos(true)}
                                className="w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
                                style={{ height: '25vh' }}
                                src={`http://localhost:4000/uploads/${place.photos[1]}`}
                                alt="Photo 2"
                            />
                        </div>
                    )}
                    {place.photos?.[2] && (
                        <div className="border border-gray-300 overflow-hidden">
                            <img
                                onClick={() => setShowAllPhotos(true)}
                                className="w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105"
                                style={{ height: '25vh' }}
                                src={`http://localhost:4000/uploads/${place.photos[2]}`}
                                alt="Photo 3"
                            />
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={() => setShowAllPhotos(true)}
                className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                </svg>
                Show more photos
            </button>
        </div>
    );
}
