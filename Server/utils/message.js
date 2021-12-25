
// Message generating function

const moment = require('moment');

let messageGeneratingFunction = (from, text) => {
    return {
        from: from,
        text: text,
        createdAt: moment().valueOf()
    };
};

module.exports = { messageGeneratingFunction };



