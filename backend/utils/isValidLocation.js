function isValidLocation(loc) {
    
    const lat = loc?.Latitude;
    const lng = loc?.Longitude;

    return (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        isFinite(lat) &&
        isFinite(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180
    );
}

module.exports = isValidLocation;