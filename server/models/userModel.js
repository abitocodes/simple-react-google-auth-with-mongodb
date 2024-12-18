import '../db/connection.js';
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    }
});

const User = mongoose.model('user', schema);

export default User;