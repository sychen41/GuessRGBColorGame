var mongoose = require('mongoose');
//just a pattern, still flexible
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

//create an object model with variables(like: name, image) and methods(like: CRUD methods)
module.exports = mongoose.model('Campground', campSchema);