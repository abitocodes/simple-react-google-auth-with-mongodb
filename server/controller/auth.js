import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import { secretKey } from '../config/secret.js';

export const authenticateUser = async (req, res, next) => {
    console.log(`authenticateUser called.`)
    let idToken = req.cookies['login'];

    try {
        const decodedMessage = jwt.verify(idToken, secretKey);
        await User.findOne({ email: decodedMessage });
        next();
    } catch (e) {
        console.log("error@authenticateUser function: ", e);
        res.status(401).send({ error: e });
    }
}