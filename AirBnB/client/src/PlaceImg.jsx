export default function PlaceImg({ place, index = 0, className = '' }) {
    if (!place?.photos?.length) {
        return null; 
    }
    
    className = className ? `${className} object-cover` : 'object-cover';
    
    const handleError = (event) => {
        event.target.src = 'http://localhost:4000/uploads/default-placeholder.png'; 
    };

    return (
        <img
            className={`${className} w-full h-full rounded-lg`} 
            src={`http://localhost:4000/uploads/${place.photos[index]}`} 
            alt="Place"
            style={{ objectFit: 'cover', height: '220px', width: '100%' }} 
            onError={handleError}
        />
    );
}
