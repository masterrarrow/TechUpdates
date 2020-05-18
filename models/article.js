const mongoose = require('mongoose');

/* Article */
const articleScheme = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    link: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    text: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    journal: {
        type: mongoose.Schema.Types.String,
        required: true
    }
});

module.exports = mongoose.model('articles', articleScheme);
