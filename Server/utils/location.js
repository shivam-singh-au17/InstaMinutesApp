
// Location generating function

const moment = require('moment');

let locationGeneratingFunction = (from, lat, lng) => {
    return {
        from: from,
        url: `https://www.google.com/maps?q=${lat}, ${lng}`,
        createdAt: moment().valueOf()
    }
}

module.exports = { locationGeneratingFunction };

