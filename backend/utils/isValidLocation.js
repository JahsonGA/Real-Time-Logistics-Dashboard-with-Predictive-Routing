function isValidLocation(loc) {
    
    const lat = loc?.Latitude;
    const lng = loc?.Longitude;

    // returns 1 if long and lat exist and are valid or 0 if they do not
    // as well as the actual values
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