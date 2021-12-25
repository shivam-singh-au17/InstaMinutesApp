
let locationGeneratingFunction = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat}, ${lng}`,
        createdAt: new Date().toTimeString()
    }
}

module.exports = { locationGeneratingFunction };

