const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Utilisation de dotenv
const dotenv = require('dotenv');
dotenv.config();
const DEFAULT_PICTURE_URL = process.env.DEFAULT_PICTURE_URL;

const userSchema = mongoose.Schema({
    pseudo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userPicture: { type: String, default: `${DEFAULT_PICTURE_URL}`, required: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);