const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sauceSchema = new Schema ({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    name: { type: String, required: true },
    manufacturer: { type: String, required: false },
    description: { type: String, required: false },
    mainPepper: { type: String, required: false },
    imageUrl: { type: String, required: false },
    heat: { type: Number, required: false },
    likes: { type: Number, required: false, default:0 },
    dislikes: { type: Number, required: false, default:0 },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
}, {timestamps: true});

module.exports = mongoose.model('Sauce', sauceSchema);